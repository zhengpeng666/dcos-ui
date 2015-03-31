var _ = require("underscore");
var md5 = require("MD5");

// TODO: Version should ideally be a global
var __VESION__ = "0.0.1";
var version = __VESION__;

var Actions = {

  beginStint: function (options) {
    this.options = _.extend({
      syncTime: 30000,
      server: null
    }, options);

    this.createdAt = Date.now();
    this.stintID = md5("session_" + this.createdAt);

    this.timeline = [];
    this.components = {};

    // TODO: Not sure if this belongs here
    // TODO: We need a way of getting pages
    this.activePage = "services";

    this.log({
      description: "Stint started."
    });
  },

  getActivePage: function () {
    return this.activePage;
  },

  /**
   * Logs arbitriary data
   */
  log: function (anything) {
    // Populates with basic data that all logs need
    var data = _.extend({
      date: this.createdAt,
      page: this.getActivePage(),
      appVersion: version,
      stintID: this.stintID
    }, anything);

    // Push to timeline
    this.timeline.push(data);
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
      data: data,
      date: Date.now()
    });
  },

  /**
   * Will log the first message with all the data to replay
   * Will log subsequent messages without data to replay
   */
  logBatchAction: function (messages, data, componentID) {
    this.logAction(messages.shift(), data, componentID);

    messages.forEach(function (message) {
      this.logAction(message, data, componentID);
    }, this);
  },

  registerComponent: function (component) {
    this.components[component.id] = component;
  },

  getComponent: function (componentID) {
    return this.components[componentID];
  },

};

module.exports = Actions;
