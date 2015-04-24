var _ = require("underscore");
var md5 = require("MD5");
var RouterLocation = require("react-router").HashLocation;

var Config = require("../config/Config");

var Actions = {

  /**
   * A hash of active components
   */
  components: {},

  activePage: "",

  initialize: function () {
    this.createdAt = Date.now();
    this.lastLogDate = this.createdAt;
    this.stintID = md5("session_" + this.createdAt);

    this.setActivePage(this.getActivePage());

    RouterLocation.addChangeListener(function (data) {
      Actions.setActivePage(data.path);
    });
  },

  canLog: function () {
    return global.analytics.initialized;
  },

  setActivePage: function (path) {
    if (this.canLog() === false) {
      return;
    }

    if (path[path.length - 1] === "/") {
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

  identify: function (info) {
    global.analytics.identify(info);
  },

  /**
   * Logs arbitriary data
   * @param  {Object} anything
   */
  log: function (anything) {
    if (this.canLog() === false) {
      return;
    }

    // Populates with basic data that all logs need
    var log = _.extend({
      description: "",
      date: Date.now(),
      page: this.activePage,
      appVersion: Config.version,
      stintID: this.stintID
    }, anything);

    log = this.prepareLog(log);

    global.analytics.track(log.description, log);
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

    // If the description is an array then prepend the current page
    // this assumes that we want a unique description for the log
    if (_.isArray(log.description)) {
      log.description.unshift(this.activePage.replace(/^\//, ""));
      log.description = log.description.join(".");
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
   * @param  {Array} description
   * @param  {Object} data
   * @param  {Number} componentID
   */
  logAction: function (description, data, componentID) {
    this.log({
      replayable: true,
      description: description,
      componentID: componentID,
      data: data
    });
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

    messages.forEach(function (message) {
      this.log({description: message});
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
  }

};

module.exports = Actions;
