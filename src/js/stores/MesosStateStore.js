var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var MesosStateActions = require("../actions/MesosStateActions");
var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");

var CHANGE_EVENT = "change";
var UPDATE_INTERVAL = 2000;

var _initCalled = false;
var _mesosState = {};
var _mesosStateFiltered = {};
var _filterOptions = {
  searchString: ""
};

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

  getFiltered: function () {
    return _mesosStateFiltered;
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

  getTotalResources: function (slaves) {
    return _.reduce(slaves, function (total, slave) {
      var resources = slave.resources;
      total.cpus += resources.cpus;
      total.mem += resources.mem;
      total.disk += resources.disk;
      return total;
    }, {cpus: 0, mem: 0, disk: 0});
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

  getFilterOptions: function () {
    return _filterOptions;
  },

  hasFilter: function () {
    return _.find(_filterOptions, function (option) {
      return !!option;
    });
  },

  applyAllFilter: function () {
    var searchPattern;

    _mesosStateFiltered = _.clone(_mesosState);

    if (_filterOptions.searchString !== "") {
      searchPattern = new RegExp(_filterOptions.searchString, "i");
      _mesosStateFiltered.frameworks = _.filter(
          _mesosStateFiltered.frameworks, function (framework) {
        return searchPattern.test(JSON.stringify(framework));
      });
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
        data.frameworks = MesosStateStore.getFrameworks(data.frameworks);
        data.totalResources = MesosStateStore.getTotalResources(data.slaves);
        _mesosState = data;
        MesosStateStore.applyAllFilter();
        MesosStateStore.emitChange();
        break;
      case ActionTypes.FILTER_SERVICES_BY_STRING:
        _filterOptions.searchString = action.data;
        MesosStateStore.applyAllFilter();
        MesosStateStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = MesosStateStore;
