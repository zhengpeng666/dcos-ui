var _ = require("underscore");

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var Config = require("../config/Config");
var EventTypes = require("../constants/EventTypes");
var GetSetMixin = require("../mixins/GetSetMixin");
var MesosSummaryUtil = require("../utils/MesosSummaryUtil");
var MesosSummaryActions = require("../events/MesosSummaryActions");
var SummaryList = require("../structs/SummaryList");
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
      MesosSummaryActions.fetchSummary, Config.getRefreshRate()
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

    let initialStates = MesosSummaryUtil.getInitialStates();
    let list = new SummaryList({maxLength: Config.historyLength});
    _.clone(initialStates).forEach(state => {
      list.addSnapshot(state, state.date);
    });

    this.set({
      initCalledAt: Date.now(), // log when we started calling
      loading: null,
      states: list,
      prevMesosStatusesMap: {},
      statesProcessed: false,
      taskFailureRate: MesosSummaryUtil.getInitialTaskFailureRates()
    });

    startPolling();
  },

  unmount: function () {
    stopPolling();
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  getServiceFromName: function (name) {
    let last = this.get("states").last();
    let services = last.getServiceList().getItems();

    return _.find(services, function (service) {
      return service.get("name") === name;
    });
  },

  hasServiceUrl: function (serviceName) {
    let service = MesosSummaryStore.getServiceFromName(serviceName);
    let webuiUrl = service.get("webui_url");

    return service && !!webuiUrl && webuiUrl.length > 0;
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

  processFailureRate: function (state, prevState) {
    var currentFailureRate = MesosSummaryUtil.getFailureRate(state, prevState);

    var taskFailureRate = this.get("taskFailureRate");
    taskFailureRate.push(currentFailureRate);
    taskFailureRate.shift();
    return taskFailureRate;
  },

  processSummary: function (data, options) {
    let states = this.get("states");
    let prevState = states.last();
    options = _.defaults({}, options, {silent: false});

    if (typeof data.date !== "number") {
      data.date = Date.now();
    }

    states.addSnapshot(data, data.date);

    // Calculate the task failure rate before we add a new snapshot
    var taskFailureRate = this.processFailureRate(states.last(), prevState);
    this.set({taskFailureRate});

    if (options.silent === false) {
      this.notifySummaryProcessed();
    }
  },

  processBulkState: function (data) {
    // Multiply Config.stateRefresh in order to use larger time slices
    data = MesosSummaryUtil.addTimestampsToData(data, Config.getRefreshRate());
    _.each(data, function (datum) {
      MesosSummaryStore.processSummary(datum, {silent: true});
    });
  },

  processSummaryError: function () {
    this.get("states").addSnapshot(null, Date.now());

    this.emit(EventTypes.MESOS_SUMMARY_REQUEST_ERROR);
  },

  processOngoingRequest: function () {
    // Handle ongoing request here.
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
      case ActionTypes.REQUEST_MESOS_SUMMARY_ONGOING:
      case ActionTypes.REQUEST_MESOS_HISTORY_ONGOING:
        MesosSummaryStore.processOngoingRequest();
        break;
    }

    return true;
  })

});

module.exports = MesosSummaryStore;
