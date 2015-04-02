var _ = require("underscore");
var md5 = require("MD5");
var RouterLocation = require("react-router").HashLocation;

var Config = require("../utils/Config");
var analyticsLoad = require("../vendor/analytics");

if (Config.analyticsKey) {
  analyticsLoad(Config.analyticsKey);
}

var Actions = {

  /**
   * A hash of active components
   */
  components: {},

  initialize: function () {
    this.createdAt = Date.now();
    this.lastLogDate = this.createdAt;
    this.stintID = md5("session_" + this.createdAt);

    this.setActivePage(this.getActivePage());

    RouterLocation.addChangeListener(function (data) {
      Actions.setActivePage(data.path);
    });
  },

  setActivePage: function (path) {
    if (path[path.length - 1] === "/") {
      path = path.substring(0, path.length - 1);
    }

    this.activePage = path;
    global.analytics.page({path: path});
  },

  getActivePage: function () {
    return RouterLocation.getCurrentPath();
  },

  /**
   * Logs arbitriary data
   */
  log: function (anything) {
    if (!Config.analyticsKey) {
      return;
    }

    // Populates with basic data that all logs need
    var data = _.extend({
      description: "",
      date: Date.now(),
      page: this.getActivePage(),
      appVersion: Config.version,
      stintID: this.stintID
    }, anything);

    data.duration = data.date - this.lastLogDate;
    this.lastLogDate = data.date;

    global.analytics.track(data.description, data);
  },

  /**
   * Logs a replayable action
   * Replayable actions are possible by watching state changes
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
  },

};

module.exports = Actions;
