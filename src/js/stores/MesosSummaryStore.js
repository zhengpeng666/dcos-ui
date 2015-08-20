var _ = require("underscore");

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var Config = require("../config/Config");
var EventTypes = require("../constants/EventTypes");
var GetSetMixin = require("../mixins/GetSetMixin");
var MarathonStore = require("./MarathonStore");
var Maths = require("../utils/Maths");
var MesosSummaryActions = require("../events/MesosSummaryActions");
var MesosStateUtil = require("../utils/MesosStateUtil");
var Store = require("../utils/Store");
var StringUtil = require("../utils/StringUtil");
var TimeScales = require("../constants/TimeScales");

var requestInterval = null;

function setHostsToFrameworkCount(frameworks) {
  return _.map(frameworks, function (framework) {
    if (framework.slave_ids == null) {
      framework.slave_ids = [];
    }
    framework.slaves_count = framework.slave_ids.length;
    return framework;
  });
}

function sumResources(resourceList) {
  return _.foldl(resourceList, function (memo, resource) {
    _.each(memo, function (value, key) {
      memo[key] = value + resource[key];
    });

    return memo;
  }, {cpus: 0, mem: 0, disk: 0});
}

/**
 * This function will create a single object of states with the sum of
 * resources in actual value and percentage of each step in the given list.
 *
 * @param {Array} list of time steps with a resources object,
 * each holding a resource value of that time step (elements by state)
 * @param {String} resourcesKey to look up the resources object
 * @return {Object} Each resource in the object holds a list of
 *   time steps with summed resources of the provided list
 * {
 *   cpus: [
 *     {date: request time, value: total cpus, percentage: of total_resources},
 *     ...
 *   ],
 *   disk: [
 *     {date: request time, value: total disk, percentage: of total_resources},
 *     ...
 *   ]
 *   mem: [
 *     {date: request time, value: total mem, percentage: of total_resources},
 *     ...
 *   ]
 * }
 */
function sumListResources(list, resourcesKey) {
  var mesosStates = MesosSummaryStore.get("mesosStates");
  return _.foldl(list, function (memo, element) {
    _.each(memo, function (value, key) {
      var values = element[resourcesKey][key];
      _.each(values, function (val, i) {
        var max = Math.max(1, mesosStates[i].total_resources[key]);
        if (value[i] == null) {
          value.push({date: val.date});
          value[i].value = 0;
        }
        value[i].value += val.value;
        value[i].percentage = Maths.round(100 * value[i].value / max);
      });

    });

    return memo;
  }, {cpus: [], mem: [], disk: []});
}

/**
 * This function will transpose a list of states into an object of resources
 * with an equal list of steps for each resource
 *
 * @param {Array} list of time steps with a resources object,
 * each holding a resource value of that time step (elements by state)
 * @param {String} resourcesKey to look up the resources object
 * @return {Object} each resource in the object holds a list of
 * time steps with resources of the provided list
 * {
 *   cpus: [
 *     {date: request time, value: cpus, percentage: of total_resources},
 *     ...
 *   ],
 *   disk: [
 *     {date: request time, value: disk, percentage: of total_resources},
 *     ...
 *   ]
 *   mem: [
 *     {date: request time, value: mem, percentage: of total_resources},
 *     ...
 *   ]
 * }
 */
function getStatesByResource(list, resourcesKey) {
  var mesosStates = MesosSummaryStore.get("mesosStates");
  var values = {cpus: [], disk: [], mem: []};
  return _.foldl(values, function (memo, arr, r) {
    _.each(list, function (state, i) {
      var value = state[resourcesKey][r];
      var max = Math.max(1, mesosStates[i].total_resources[r]);
      memo[r].push({
        date: state.date,
        value: Maths.round(value, 2),
        percentage: Maths.round(100 * value / max)
      });
    });
    return memo;
  }, values);
}

function getFrameworksTaskTotals(frameworks) {
  if (frameworks.length === 0) {
    return {};
  }

  var tasks = {
    TASK_STAGING: 0,
    TASK_STARTING: 0,
    TASK_RUNNING: 0,
    TASK_FINISHED: 0,
    TASK_FAILED: 0,
    TASK_LOST: 0,
    TASK_ERROR: 0
  };
  var taskTypes = Object.keys(tasks);

  // Loop through all frameworks
  frameworks.forEach(function (framework) {
    taskTypes.forEach(function (taskType) {
      if (framework[taskType]) {
        tasks[taskType] += framework[taskType];
      }
    });
  });

  return tasks;
}

// Caluculate a failure rate
function getFailureRate(mesosState, prevMesosState) {
  var prevMesosStatusesMap = getFrameworksTaskTotals(prevMesosState.frameworks);
  var newMesosStatusesMap = getFrameworksTaskTotals(mesosState.frameworks);
  var failed = 0;
  var successful = 0;
  var diff = {};

  // Only compute diff if we have previous data
  var keys = Object.keys(newMesosStatusesMap);
  // Ignore the first difference, since the first number of accumulated failed
  // tasks will be will consist the base case for calulating the difference
  if (prevMesosStatusesMap != null && keys.length) {
    keys.forEach(function (key) {
      diff[key] = newMesosStatusesMap[key] - prevMesosStatusesMap[key];
    });

    // refs: https://github.com/apache/mesos/blob/master/include/mesos/mesos.proto
    successful = (diff.TASK_STAGING || 0) +
      (diff.TASK_STARTING || 0) +
      (diff.TASK_RUNNING || 0) +
      (diff.TASK_FINISHED || 0);
    failed = (diff.TASK_FAILED || 0) +
      (diff.TASK_LOST || 0) +
      (diff.TASK_ERROR || 0);
  }

  return {
    date: mesosState.date,
    rate: (failed / (failed + successful)) * 100 | 0
  };
}

/**
 * This function will create a list of frameworks with an object of used
 * resources. Each resource holds a list of steps equal to the mesos states
 *
 * @return {Array} List of frameworks with color and name details, etc.
 * Each framework has its on set of resources. See getStatesByResource for
 * more information.
 * [{
 *   colorIndex: 0,
 *   name: "Marathon",
 *   used_resorces: {
 *     cpus: [...],
 *     disk: [...],
 *     mem: [...],
 *   }
 * }, ...]
 */
function getStatesByFramework() {
  var mesosStates = MesosSummaryStore.get("mesosStates");
  return _.chain(mesosStates)
    .pluck("frameworks")
    .flatten()
    .groupBy(function (framework) {
      return framework.id;
    })
    .map(function (framework) {
      var lastFramework = _.clone(_.last(framework));

      return _.extend(
        lastFramework,
        {used_resources: getStatesByResource(framework, "used_resources")}
      );
    })
    .value();
}

/**
 * Given mesos states and a slave, this function will create an object of used
 * resources. Each resource holds a list of steps equal to the mesos states
 *
 * @param {Array} mesosStates of time steps with a total_resources object,
 * each holding a resource value of that time step (elements by state)
 * @param {Object} slave object to calculate resources from
 * @return {Object} Calculated resources for the given slave
 * {
 *   cpus: [
 *     {date: request time, value: cpus, percentage: of total_resources},
 *     ...
 *   ],
 *   disk: [
 *     {date: request time, value: disk, percentage: of total_resources},
 *     ...
 *   ]
 *   mem: [
 *     {date: request time, value: mem, percentage: of total_resources},
 *     ...
 *   ]
 * }
 */
function getHostResourcesBySlave(mesosStates, slave) {
  return _.foldl(mesosStates, function (memo, state) {
    var foundSlave = _.findWhere(state.slaves, {id: slave.id});
    var resources;

    if (foundSlave && foundSlave.used_resources) {
      resources = _.pick(foundSlave.used_resources, "cpus", "mem", "disk");
    } else {
      resources = {cpus: 0, mem: 0, disk: 0};
    }

    _.each(resources, function (resourceVal, resourceKey) {
      memo[resourceKey].push({
        date: state.date,
        value: resourceVal,
        percentage:
          Maths.round(
            100 * resourceVal / Math.max(1, slave.resources[resourceKey])
          )
      });
    });
    return memo;
  }, {cpus: [], mem: [], disk: []});
}

/**
 * This function will create a list of hosts with an object of used
 * resources. Each resource holds a list of steps equal to the mesos states
 *
 * @return {Array} List of hosts with resources as time steps
 * [{
 *  ...
 *  id: "",
 *  hostname: "",
 *  tasks: {},
 *  frameworks: {},
 *  used_resources: {cpus: [], mem: [], disk: []}
 * }]
 */
function getStateByHosts() {
  var mesosStates = MesosSummaryStore.get("mesosStates");
  return _.map(_.last(mesosStates).slaves, function (slave) {
    var _return = _.clone(slave);
    _return.used_resources = getHostResourcesBySlave(mesosStates, slave);

    return _return;
  });
}

function getActiveSlaves(slaves) {
  return _.where(slaves, {active: true});
}

function filterByString(objects, key, searchString) {
  var searchPattern = new RegExp(StringUtil.escapeForRegExp(searchString), "i");

  return _.filter(objects, function (obj) {
    return searchPattern.test(obj[key]);
  });
}

function getInitialStates() {
  var currentDate = Date.now();
  // reverse date range!!!
  return _.map(_.range(-Config.historyLength, 0), function (i) {
    return {
      date: currentDate + (i * Config.stateRefresh),
      frameworks: [],
      slaves: [],
      used_resources: {cpus: 0, mem: 0, disk: 0},
      total_resources: {cpus: 0, mem: 0, disk: 0},
      active_slaves: 0
    };
  });
}

function getInitialTaskFailureRates() {
  var currentDate = Date.now();
  return _.map(_.range(-Config.historyLength, 0), function (i) {
    return {
      date: currentDate + (i * Config.stateRefresh),
      rate: 0
    };
  });
}

function addTimestampsToData(data, timeStep) {
  var length = data.length;
  var timeNow = Date.now() - timeStep;

  return _.map(data, function (datum, i) {
    var timeDelta = (-length + i) * timeStep;
    datum.date = timeNow + timeDelta;
    return datum;
  });
}

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
      mesosStates: getInitialStates(),
      prevMesosStatusesMap: {},
      statesProcessed: false,
      taskFailureRate: getInitialTaskFailureRates()
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

  getRefreshRate: function () {
    return Config.stateRefresh;
  },

  getLatest: function () {
    return _.last(this.get("mesosStates"));
  },

  getFrameworks: function (filterOptions) {
    filterOptions = filterOptions || {};
    var frameworks = getStatesByFramework();

    if (filterOptions) {
      if (filterOptions.healthFilter != null) {
        frameworks = MesosStateUtil.filterByHealth(frameworks, filterOptions.healthFilter);
      }

      if (filterOptions.searchString !== "") {
        frameworks = MesosStateUtil.filterByString(frameworks,
          "name",
          filterOptions.searchString
        );
      }
    }

    return frameworks;
  },

  getTotalFrameworksResources: function (frameworks) {
    return sumListResources(frameworks, "used_resources");
  },

  getTotalHostsResources: function (hosts) {
    return sumListResources(hosts, "used_resources");
  },

  getFrameworksWithHostsCount: function (hosts) {
    return setHostsToFrameworkCount(this.getLatest().frameworks, hosts);
  },

  getHosts: function (filterOptions) {
    filterOptions = filterOptions || {};
    var hosts = getStateByHosts();

    if (filterOptions) {
      if (filterOptions.byServiceFilter != null) {
        hosts = MesosStateUtil.filterHostsByService(hosts, filterOptions.byServiceFilter);
      }

      if (filterOptions.searchString !== "") {
        hosts = filterByString(hosts,
          "hostname",
          filterOptions.searchString
        );
      }
    }

    return hosts;
  },

  getActiveHostsCount: function () {
    return _.map(this.get("mesosStates"), function (state) {
      return {
        date: state.date,
        slavesCount: state.active_slaves || 0
      };
    });
  },

  getTaskTotals: function () {
    return getFrameworksTaskTotals(this.getLatest().frameworks);
  },

  getTotalResources: function () {
    var mesosStates = this.get("mesosStates");
    return getStatesByResource(mesosStates, "total_resources");
  },

  getAllocResources: function () {
    var mesosStates = this.get("mesosStates");
    return getStatesByResource(mesosStates, "used_resources");
  },

  emitChange: function (eventName) {
    this.emit(eventName);
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  updateStateProcessed: function () {
    this.set({statesProcessed: true});
    this.emitChange(EventTypes.MESOS_SUMMARY_CHANGE);
  },

  notifySummaryProcessed: function () {
    var initCalledAt = this.get("initCalledAt");
    // skip if state is processed, already loading or init has not been called
    if (this.get("statesProcessed") ||
        this.get("loading") != null ||
        initCalledAt == null) {
      this.emitChange(EventTypes.MESOS_SUMMARY_CHANGE);
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

    var normalizedFrameworks = _.map(frameworks, function (framework) {
      var index = _.indexOf(frameworkIDs, framework.id);
      framework.date = date;

      // if this is a new framework, add it to the IDs and names arrays
      if (index === -1) {
        frameworkIDs.push(framework.id);
        frameworkNames.push(framework.name);
        index = frameworkIDs.length - 1;
      }

      return framework;
    });

    // Update our ID and name lists
    this.set({frameworkIDs, frameworkNames});

    return normalizedFrameworks;
  },

  processFailureRate: function (mesosState) {
    var currentFailureRate = getFailureRate(mesosState, this.getLatest());

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
    data.total_resources = sumResources(_.pluck(data.slaves, "resources"));
    data.used_resources = sumResources(
      _.pluck(data.frameworks, "used_resources")
    );
    data.active_slaves = getActiveSlaves(data.slaves).length;

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
    data = addTimestampsToData(data, Config.stateRefresh);
    _.each(data, function (datum) {
      MesosSummaryStore.processSummary(datum, {silent: true});
    });
  },

  processSummaryError: function () {
    this.emitChange(EventTypes.MESOS_SUMMARY_REQUEST_ERROR);
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
