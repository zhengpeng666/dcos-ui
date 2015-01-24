var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var MesosStateActions = require("../actions/MesosStateActions");
var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");

var CHANGE_EVENT = "change";
var UPDATE_INTERVAL = 2000;

var _initCalled = false;
var _mesosState = {};

var MesosStateStore = _.extend({}, EventEmitter.prototype, {

  init: function () {
    if (_initCalled) {
      return;
    }

    _initCalled = true;
    this.startPolling();
  },

  getAll: function () {
    return _mesosState;
  },

  startPolling: function () {
    if (this._interval == null) {
      MesosStateActions.fetch();
      this._interval = setInterval(MesosStateActions.fetch, UPDATE_INTERVAL);
    }
  },

  stopPolling: function () {
    if (this._interval != null) {
      clearInterval(this._interval);
      this._interval = null;
    }
  },

  getFrameworks: function (frameworks) {
    var displayKeys = [
      "active",
      "completed_tasks",
      "hostname",
      "id",
      "name",
      "offers",
      "resources",
      "tasks",
      "user"
    ];

    return _.map(frameworks, function (framework) {
      return _.reduce(framework, function (obj, val, key) {
        if (_.contains(displayKeys, key)) {
          obj[key] = val;
        }
        return obj;
      }, {});
    });
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var action = payload.action;
    var data;

    switch (action.type) {
      case ActionTypes.REQUEST_MESOS_STATE:
        data = action.data;
        data.frameworks = MesosStateStore.getFrameworks(data.frameworks);
        _mesosState = data;
        MesosStateStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = MesosStateStore;
