var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var MesosStateActions = require("../actions/MesosStateActions");
var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");

var CHANGE_EVENT = "change";
var UPDATE_INTERVAL = 2000;
var _initCalled = false;

/* jshint camelcase:false */
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
var _mesosState = {
  activated_slaves: null,
  build_date: null,
  build_time: null,
  build_user: null,
  completed_frameworks:[],
  deactivated_slaves:0,
  elected_time: null,
  failed_tasks: 0,
  finished_tasks: 0,
  flags: null,
  frameworks:[],
  git_branch: null,
  git_sha: null,
  hostname: null,
  id: null,
  killed_tasks:0,
  leader: null,
  log_dir: null,
  lost_tasks:0,
  orphan_tasks:[],
  pid: null,
  slaves:[],
  staged_tasks: 0,
  start_time: null,
  started_tasks: 0,
  unregistered_frameworks:[],
  version: null
};
/* jshint camelcase:true */
/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

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
        data.date = Date.now();
        _mesosState = data;
        MesosStateStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = MesosStateStore;
