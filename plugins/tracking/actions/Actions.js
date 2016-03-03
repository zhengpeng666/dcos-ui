var _ = require('underscore');
var md5 = require('md5');
var RouterLocation = require('react-router').HashLocation;

import {
  REQUEST_INTERCOM_OPEN,
  REQUEST_INTERCOM_CLOSE
} from '../constants/ActionTypes';

import IntercomStore from '../stores/IntercomStore';

var AppDispatcher = require('../../../src/js/events/AppDispatcher');

let SDK = require('../SDK').getSDK();
let Config = SDK.get('Config');

var Actions = {
  /**
   * A hash of active components
   */
  components: {},

  activePage: '',

  previousFakePageLog: '',

  clusterID: null,

  logQueue: [],

  initialize: function () {
    this.createdAt = Date.now();
    this.lastLogDate = this.createdAt;
    this.stintID = md5(`session_${this.createdAt}`);

    this.setActivePage(this.getActivePage());

    RouterLocation.addChangeListener(function (data) {
      Actions.setActivePage(data.path);
    });
  },

  setClusterID: function (clusterID) {
    this.clusterID = clusterID;

    if (this.logQueue.length) {
      this.logQueue.forEach((log) => {
        this.log(log);
      });

      this.logQueue = [];
    }
  },

  canLog: function () {
    return !!(global.analytics && global.analytics.initialized);
  },

  logFakePageView: function (fakePageLog) {
    if (this.canLog() === false) {
      return;
    }

    if (_.isEqual(this.previousFakePageLog, fakePageLog)) {
      return;
    }

    global.analytics.page(fakePageLog);
    this.previousFakePageLog = fakePageLog;
  },

  setActivePage: function (path) {
    if (this.canLog() === false) {
      return;
    }

    if (path[path.length - 1] === '/') {
      path = path.substring(0, path.length - 1);
    }

    this.activePage = path;
    global.analytics.page({path: path});
  },

  getActivePage: function () {
    return RouterLocation.getCurrentPath();
  },

  getStintID: function () {
    return this.stintID;
  },

  identify: function () {
    if (this.canLog() === false) {
      return;
    }

    global.analytics.identify.apply(global.analytics, arguments);
    this.log({
      eventID: 'Logged in'
    });
  },

  /**
   * Logs arbitriary data
   * @param  {Object} anything
   */
  log: function (anything) {
    if (this.canLog() === false) {
      return;
    }

    if (this.clusterID == null) {
      this.logQueue.push(anything);
      return;
    }

    // Populates with basic data that all logs need
    var log = _.extend({
      appVersion: Config.version,
      eventID: '',
      date: Date.now(),
      CLUSTER_ID: this.clusterID,
      page: this.activePage,
      stintID: this.stintID,
      version: '@@VERSION'
    }, anything);

    log = this.prepareLog(log);

    global.analytics.track('dcos-ui', log);
  },

  /**
   * Normalizes and prepares log object
   *
   * @param {Object} log
   * @return {Object} Formatted log
   */
  prepareLog: function (log) {
    // Create a unique event id if we have enough properties
    // to consider this even unique
    if (log.data && log.componentID) {
      var id = log.page + log.componentID + JSON.stringify(log.data);
      log.uniqueEventID = md5(id);
    }

    // If the eventID is an array then prepend the current page
    // this assumes that we want a unique eventID for the log
    if (_.isArray(log.eventID)) {
      log.eventID.unshift(this.activePage.replace(/^\//, ''));
      log.eventID = log.eventID.join('.');
    }

    // Calculate the time since the last event
    log.duration = log.date - this.lastLogDate;
    this.lastLogDate = log.date;

    return log;
  },

  /**
   * Logs a replayable action
   * Replayable actions are possible by watching state changes
   *
   * @param  {Array} eventID
   * @param  {Object} data
   * @param  {Number} componentID
   */
  logAction: function (eventID, data, componentID) {
    this.log({replayable: true, eventID, componentID, data});
  },

  /**
   * Will log the first message with all the data to replay
   * Will log subsequent messages without data to replay
   *
   * @param  {Array} messages
   * @param  {Object} data
   * @param  {Number} componentID
   */
  logBatchAction: function (messages, data, componentID) {
    this.logAction(messages.shift(), data, componentID);

    messages.forEach(function (eventID) {
      this.log({eventID});
    }, this);
  },

  registerComponent: function (component) {
    this.components[component.id] = component;
  },

  deregisterComponent: function (componentID) {
    if (this.components[componentID]) {
      delete this.components[componentID];
    }
  },

  getComponent: function (componentID) {
    return this.components[componentID];
  },

  openIntercom: function () {
    AppDispatcher.handleIntercomAction({
      type: REQUEST_INTERCOM_OPEN,
      data: true
    });
  },

  closeIntercom: function () {
    AppDispatcher.handleIntercomAction({
      type: REQUEST_INTERCOM_CLOSE,
      data: false
    });
  },

  isIntercomOpen() {
    return IntercomStore.get('isOpen');
  }

};

module.exports = Actions;
