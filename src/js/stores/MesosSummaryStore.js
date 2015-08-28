var _ = require("underscore");

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var Config = require("../config/Config");
var EventTypes = require("../constants/EventTypes");
var GetSetMixin = require("../mixins/GetSetMixin");
var MarathonStore = require("./MarathonStore");
var MesosSummaryUtil = require("../utils/MesosSummaryUtil");
var MesosSummaryActions = require("../events/MesosSummaryActions");
var StringUtil = require("../utils/StringUtil");
var Store = require("../utils/Store");
var TimeScales = require("../constants/TimeScales");

var requestInterval = null;

function startPolling() {
  if (requestInterval == null) {
    var timeScale;

    if (!MesosSummaryStore.get("statesProcessed")) {
      timeScale = TimeScales.MINUTE;
    }

    MesosSummaryActions.fetchSummary(timeScale);
    requestInterval = setInterval(
      MesosSummaryActions.fetchSummary, Config.stateRefresh
    );
  }
}

function stopPolling() {
  if (requestInterval != null) {
    clearInterval(requestInterval);
    requestInterval = null;
  }
}

var MesosSummaryStore = Store.createStore({

  mixins: [GetSetMixin],

  init: function () {

    if (this.get("initCalledAt") != null) {
      return;
    }

    this.set({
      appsProcessed: false,
      frameworkIDs: [],
      frameworkHealth: {},
      frameworkImages: {},
      frameworkNames: [],
      initCalledAt: Date.now(), // log when we started calling
      loading: null,
      mesosStates: MesosSummaryUtil.getInitialStates(),
      prevMesosStatusesMap: {},
      statesProcessed: false,
      taskFailureRate: MesosSummaryUtil.getInitialTaskFailureRates()
    });

    startPolling();
    this.onMarathonAppsChange = this.onMarathonAppsChange.bind(this);
    this.onMarathonAppsError = this.onMarathonAppsError.bind(this);

    MarathonStore.addChangeListener(
      EventTypes.MARATHON_APPS_CHANGE, this.onMarathonAppsChange
    );
    MarathonStore.addChangeListener(
      EventTypes.MARATHON_APPS_ERROR, this.onMarathonAppsError
    );

  },

  unmount: function () {
    stopPolling();
    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_CHANGE, this.onMarathonAppsChange
    );
    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_ERROR, this.onMarathonAppsError
    );
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  getRefreshRate: function () {
    return Config.stateRefresh;
  },

  getLatest: function () {
    return _.last(this.get("mesosStates"));
  },

  getTotalFrameworksResources: function (frameworks) {
    return MesosSummaryUtil.sumListResources(
      this.get("mesosStates"), frameworks, "used_resources"
    );
  },

  getTotalHostsResources: function (hosts) {
    return MesosSummaryUtil.sumListResources(
      this.get("mesosStates"), hosts, "used_resources"
    );
  },

  getFrameworksWithHostsCount: function () {
    return MesosSummaryUtil.getFrameworksWithHostsCount(
      this.getLatest().frameworks
    );
  },

  getActiveHostsCount: function () {
    return _.map(this.get("mesosStates"), function (state) {
      return {
        date: state.date,
        slavesCount: state.active_slaves || 0
      };
    });
  },

  getServiceFromName: function (name) {
    let services = this.getLatest().frameworks;

    return _.find(services, function (service) {
      return service.name === name;
    });
  },

  getTaskTotals: function () {
    return MesosSummaryUtil.getFrameworksTaskTotals(
      this.getLatest().frameworks
    );
  },

  getTotalResources: function () {
    var mesosStates = this.get("mesosStates");
    return MesosSummaryUtil.getStatesByResource(
      this.get("mesosStates"), mesosStates, "total_resources"
    );
  },

  getAllocResources: function () {
    var mesosStates = this.get("mesosStates");
    return MesosSummaryUtil.getStatesByResource(
      this.get("mesosStates"), mesosStates, "used_resources"
    );
  },

  getFrameworks: function (filters) {
    var mesosStates = this.get("mesosStates");
    var frameworks = MesosSummaryUtil.getStatesByFramework(mesosStates);

    if (filters) {
      if (filters.healthFilter != null) {
        frameworks = this.filterByHealth(frameworks, filters.healthFilter);
      }

      if (filters.searchString && filters.searchString !== "") {
        frameworks = StringUtil.filterByString(
          frameworks,
          "name",
          filters.searchString
        );
      }
    }

    return frameworks;
  },

  getHosts: function (filters) {
    var hosts = MesosSummaryUtil.getStateByHosts(this.get("mesosStates"));

    if (filters) {
      if (filters.byServiceFilter != null) {
        hosts = MesosSummaryUtil.filterHostsByService(
          hosts, filters.byServiceFilter
        );
      }

      if (filters.searchString && filters.searchString !== "") {
        hosts = StringUtil.filterByString(
          hosts,
          "hostname",
          filters.searchString
        );
      }
    }

    return hosts;
  },

  // TODO: Try to move this method to MesosSummaryUtil
  filterByHealth: function (objects, healthFilter) {
    return _.filter(objects, function (obj) {
      let appHealth = MarathonStore.getServiceHealth(obj.name);
      return appHealth.value === healthFilter;
    });
  },

  updateStateProcessed: function () {
    this.set({statesProcessed: true});
    this.emit(EventTypes.MESOS_SUMMARY_CHANGE);
  },

  notifySummaryProcessed: function () {
    var initCalledAt = this.get("initCalledAt");
    // skip if state is processed, already loading or init has not been called
    if (this.get("statesProcessed") ||
        this.get("loading") != null ||
        initCalledAt == null) {
      this.emit(EventTypes.MESOS_SUMMARY_CHANGE);
      return;
    }

    var msLeftOfDelay = Config.stateLoadDelay - (Date.now() - initCalledAt);
    if (msLeftOfDelay < 0) {
      this.updateStateProcessed();
    } else {
      this.set({
        loading: setTimeout(
          this.updateStateProcessed.bind(this),
          msLeftOfDelay
        )
      });
    }
  },

  /**
   * This function will normalize a given framwork list adding necessary
   * information to the frameworks and mesos states
   *
   * @param {Array} frameworks to normalize
   * @param {Date} date Time step for the current data
   * @return {Array} List of frameworks with normalized data
   * [{
   *   frameworks:[{
   *     colorIndex: 0,
   *     date: request time,
   *     name: "Marathon",
   *     resources: {...},
   *     ...
   *   }]
   * ]}]
   */
  normalizeFrameworks: function (frameworks, date) {
    var frameworkIDs = this.get("frameworkIDs");
    var frameworkNames = this.get("frameworkNames");
    var mesosStates = this.get("mesosStates");

    var normalizedFrameworks = _.map(frameworks, function (framework) {
      var index = _.indexOf(frameworkIDs, framework.id);
      framework.date = date;

      // this is a new framework, fill in 0s for all the previous datapoints
      if (index === -1) {
        frameworkIDs.push(framework.id);
        frameworkNames.push(framework.name);
        index = frameworkIDs.length - 1;
        MesosSummaryUtil.addFrameworkToPreviousStates(
          mesosStates, framework, index
        );
      }
      // set color index after discovering and assigning index framework
      framework.colorIndex = index;

      return framework;
    });

    // Update our ID and name lists
    this.set({frameworkIDs, frameworkNames});

    return normalizedFrameworks;
  },

  processFailureRate: function (mesosState) {
    var currentFailureRate = MesosSummaryUtil.getFailureRate(
      mesosState, this.getLatest()
    );

    var taskFailureRate = this.get("taskFailureRate");
    taskFailureRate.push(currentFailureRate);
    taskFailureRate.shift();
    return taskFailureRate;
  },

  processSummary: function (data, options) {
    options = _.defaults({}, options, {silent: false});

    if (typeof data.date !== "number") {
      data.date = Date.now();
    }

    data.slaves = data.slaves || [];
    data.frameworks = this.normalizeFrameworks(data.frameworks, data.date);
    data.total_resources = MesosSummaryUtil.sumResources(
      _.pluck(data.slaves, "resources")
    );
    data.used_resources = MesosSummaryUtil.sumResources(
      _.pluck(data.frameworks, "used_resources")
    );
    data.active_slaves = _.where(data.slaves, {active: true}).length;

    var taskFailureRate = this.processFailureRate(data);
    this.set({taskFailureRate});

    // Add new snapshot
    var mesosStates = this.get("mesosStates");
    mesosStates.push(data);
    // Remove oldest snapshot when we have more than we should
    if (mesosStates.length > Config.historyLength) {
      mesosStates.shift();
    }
    this.set({mesosStates});

    if (options.silent === false) {
      this.notifySummaryProcessed();
    }
  },

  processBulkState: function (data) {
    // Multiply Config.stateRefresh in order to use larger time slices
    data = MesosSummaryUtil.addTimestampsToData(data, Config.stateRefresh);
    _.each(data, function (datum) {
      MesosSummaryStore.processSummary(datum, {silent: true});
    });
  },

  processSummaryError: function () {
    this.emit(EventTypes.MESOS_SUMMARY_REQUEST_ERROR);
  },

  onMarathonAppsChange: function (apps) {
    var frameworkNames = this.get("frameworkNames");

    var marathonData = _.foldl(apps, function (curr, app, packageName) {
      // Find the framework based on package name
      var frameworkName = _.find(frameworkNames, function (name) {
        // Use insensitive check
        if (name.length) {
          name = name.toLowerCase();
        }

        // Match exactly (case insensitive)
        return name === packageName;
      });

      if (packageName === "marathon") {
        frameworkName = packageName;
      }

      if (frameworkName == null) {
        return curr;
      }

      curr.frameworkHealth[frameworkName] = app.health;
      curr.frameworkImages[frameworkName] = app.images;

      return curr;
    }, {frameworkHealth: {}, frameworkImages: {}});

    marathonData.appsProcessed = true;

    this.set(marathonData);
  },

  onMarathonAppsError: function () {
    this.set({appsProcessed: true});
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    var action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_MESOS_SUMMARY_SUCCESS:
        MesosSummaryStore.processSummary(action.data);
        break;
      case ActionTypes.REQUEST_MESOS_HISTORY_SUCCESS:
        MesosSummaryStore.processBulkState(action.data);
        break;
      case ActionTypes.REQUEST_MESOS_SUMMARY_ERROR:
      case ActionTypes.REQUEST_MESOS_HISTORY_ERROR:
        MesosSummaryStore.processSummaryError();
        break;
    }

    return true;
  })

});

module.exports = MesosSummaryStore;
