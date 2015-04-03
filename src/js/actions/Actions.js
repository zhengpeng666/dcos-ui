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

  canLog: function () {
    return !!Config.analyticsKey;
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

  getIdentitiy: function (callback) {
    global.analytics.ready(function () {
      var identity = global.analytics.user().traits();
      if (_.keys(identity).length > 0) {
        callback(identity);
        // we need to identify to trigger intercom
        callback(identity);
        global.analytics.identify(identity);
      } else {
        callback();
      }
    });
  },

  identify: function (info, callback) {
    global.analytics.identify(info, callback);
  },

  /**
   * Logs arbitriary data
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

    if (log.data && log.componentID) {
      var id = log.page + log.componentID + JSON.stringify(log.data);
      log.uniqueEventID = md5(id);
    }

    log.duration = log.date - this.lastLogDate;
    this.lastLogDate = log.date;

    global.analytics.track(log.description, log);
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
