import _ from 'underscore';
import {Store} from 'mesosphere-shared-reactjs';

import AppDispatcher from '../events/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import CompositeState from '../structs/CompositeState';
import Config from '../config/Config';
import {
  MESOS_SUMMARY_CHANGE,
  MESOS_SUMMARY_REQUEST_ERROR,
  VISIBILITY_CHANGE
} from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';
import MesosSummaryUtil from '../utils/MesosSummaryUtil';
import MesosSummaryActions from '../events/MesosSummaryActions';
import SummaryList from '../structs/SummaryList';
import StateSummary from '../structs/StateSummary';
import TimeScales from '../constants/TimeScales';
import VisibilityStore from './VisibilityStore';

var requestInterval = null;

function startPolling() {
  if (requestInterval == null) {
    var timeScale;

    if (!MesosSummaryStore.get('statesProcessed')) {
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

function handleInactiveChange() {
  let isInactive = VisibilityStore.get('isInactive');
  if (isInactive) {
    MesosSummaryStore.terminate();
  } else {
    MesosSummaryStore.init();
  }
}

VisibilityStore.addChangeListener(VISIBILITY_CHANGE, handleInactiveChange);

var MesosSummaryStore = Store.createStore({
  storeID: 'summary',

  mixins: [GetSetMixin],

  init: function () {
    if (this.get('initCalledAt') != null) {
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

  terminate: function () {
    stopPolling();
    this.set({initCalledAt: null});
  },

  unmount: function () {
    this.set({
      initCalledAt: null,
      loading: null,
      states: [],
      prevMesosStatusesMap: {},
      statesProcessed: false,
      taskFailureRate: []
    });

    stopPolling();
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  getActiveServices: function () {
    return this.get('states').lastSuccessful().getServiceList().getItems();
  },

  getServiceFromName: function (name) {
    let services = this.getActiveServices();

    return _.find(services, function (service) {
      return service.get('name') === name;
    });
  },

  hasServiceUrl: function (serviceName) {
    let service = MesosSummaryStore.getServiceFromName(serviceName);
    let webuiUrl = service.get('webui_url');

    return service && !!webuiUrl && webuiUrl.length > 0;
  },

  setFailureRate: function (state, prevState) {
    var taskFailureRate = this.processFailureRate(state, prevState);
    this.set({taskFailureRate});
  },

  updateStateProcessed: function () {
    this.set({statesProcessed: true});
    this.emit(MESOS_SUMMARY_CHANGE);
  },

  notifySummaryProcessed: function () {
    var initCalledAt = this.get('initCalledAt');
    // skip if state is processed, already loading or init has not been called
    if (this.get('statesProcessed') ||
        this.get('loading') != null ||
        initCalledAt == null) {
      this.emit(MESOS_SUMMARY_CHANGE);
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

    var taskFailureRate = this.get('taskFailureRate');
    taskFailureRate.push(currentFailureRate);
    taskFailureRate.shift();
    return taskFailureRate;
  },

  processSummary: function (data, options = {}) {
    let states = this.get('states');
    let prevState = states.last();

    if (typeof data.date !== 'number') {
      data.date = Date.now();
    }

    CompositeState.addSummary(data);

    states.addSnapshot(data, data.date);
    this.setFailureRate(states.last(), prevState);

    if (!options.silent) {
      this.notifySummaryProcessed();
    }
  },

  processBulkState: function (data) {
    // BUG: Will remove once we confirm the source of error
    if (!Array.isArray(data)) {
      throw Error(`${data} is not an Array.`);
    }
    // Multiply Config.stateRefresh in order to use larger time slices
    data = MesosSummaryUtil.addTimestampsToData(data, Config.getRefreshRate());
    _.each(data, function (datum) {
      MesosSummaryStore.processSummary(datum, {silent: true});
    });
  },

  processSummaryError: function (options = {}) {
    let unsuccessfulSummary = new StateSummary({successful: false});
    let states = this.get('states');
    let prevState = states.last();

    states.add(unsuccessfulSummary);
    this.setFailureRate(states.last(), prevState);

    if (!options.silent) {
      this.emit(MESOS_SUMMARY_REQUEST_ERROR);
    }
  },

  processOngoingRequest: function () {
    // Handle ongoing request here.
  },

  processBulkError: function () {
    for (let i = 0; i < Config.historyLength; i++) {
      MesosSummaryStore.processSummaryError({silent: true});
    }
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
        MesosSummaryStore.processSummaryError();
        break;
      case ActionTypes.REQUEST_MESOS_HISTORY_ERROR:
        MesosSummaryStore.processBulkError();
        break;
      case ActionTypes.REQUEST_MESOS_SUMMARY_ONGOING:
      case ActionTypes.REQUEST_MESOS_HISTORY_ONGOING:
        MesosSummaryStore.processSummaryError();
        break;
    }

    return true;
  })

});

module.exports = MesosSummaryStore;
