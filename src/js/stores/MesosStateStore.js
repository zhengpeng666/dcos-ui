var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var MesosStateActions = require("../actions/MesosStateActions");
var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");

var CHANGE_EVENT = "change";
var STATE_REFRESH = 2000;
var HISTORY_LENGTH = 30;

var _initCalled = false;
var _mesosStateFiltered = {};
var _filterOptions = {
  searchString: ""
};
var _frameworkIndexes = [];
var _mesosStates = [];
var _mesosStatesTransposed = {};

var MesosStateStore = _.extend({}, EventEmitter.prototype, {

  init: function () {
    if (_initCalled) {
      return;
    }

    _initCalled = true;

    this.initStates();

    this.startPolling();
  },

  getAll: function () {
    return _mesosStates;
  },

  getLatest: function () {
    return _.last(_mesosStates);
  },

  getTransposed: function () {
    return _mesosStatesTransposed;
  },

  getFiltered: function () {
    return _mesosStateFiltered;
  },

  initStates: function () {
    var currentDate = Date.now();
    // reverse date range!!!
    _mesosStates = _.map(_.range(-HISTORY_LENGTH, 0), function (i) {
      return {
        date: currentDate + (i * STATE_REFRESH),
        frameworks: [],
        slaves: []
      };
    });

    this.updateTransposed();
  },

  getFilterOptions: function () {
    return _filterOptions;
  },

  hasFilter: function () {
    return _.find(_filterOptions, function (option) {
      return !_.isEmpty(option);
    });
  },

  startPolling: function () {
    if (this._interval == null) {
      MesosStateActions.fetch();
      this._interval = setInterval(MesosStateActions.fetch, STATE_REFRESH);
    }
  },

  stopPolling: function () {
    if (this._interval != null) {
      clearInterval(this._interval);
      this._interval = null;
    }
  },

  sumResources: function (resourceList) {
    return _.reduce(resourceList, function (sumMap, resource) {
      _.each(sumMap, function (value, key) {
        sumMap[key] = value + resource[key];
      });

      return sumMap;
    }, { cpus: 0, mem: 0, disk: 0 });
  },

  fillFramework: function (name, colorIndex) {
    _.each(_mesosStates, function (state) {
      state.frameworks.push({
        name: name,
        date: state.date,
        colorIndex: colorIndex,
        resources: {
          cpus: 0,
          mem: 0,
          disk: 0
        }
      });
    });
  },

  // [{
  //   frameworks:[{
  //     colorIndex: 0,
  //     date: request time,
  //     name: "Marathon",
  //     resources: {...},
  //     ...
  //   }]
  // ]}]
  getFrameworks: function (data) {
    var frameworks = _.map(data.frameworks, function (framework) {
      framework.date = data.date;
      var index = _.indexOf(_frameworkIndexes, framework.name);
      // this is a new framework, fill in 0s for all the previous datapoints
      if (index === -1) {
        _frameworkIndexes.push(framework.name);
        index = _frameworkIndexes.length - 1;
        this.fillFramework(framework.name, index);
      }
      // set color index after discovering and assigning index framework
      framework.colorIndex = index;
      return framework;
    }, this);

    return frameworks;
  },

  // [{
  //   cpus: [{date: request time, y: value}]
  //   disk: [{date: request time, y: value}]
  //   mem: [{date: request time, y: value}]
  // }]
  createValuesArray: function (framework) {
    var values = {"cpus": [], "disk": [], "mem": []};
    return _.reduce(values, function (acc, arr, r) {
      _.map(framework, function (v) {
        acc[r].push({
          date: v.date,
          y: v.resources[r]
        });
      });
      return acc;
    }, values);
  },

  applySearchString: function (frameworks, searchString) {
    var searchPattern = new RegExp(searchString, "i");
    var valuesPattern = /:\"[^\"]+\"/g;
    var cleanupPattern = /[:\"]/g;

    return _.filter(frameworks, function (framework) {
      var str = JSON.stringify(framework)
        .match(valuesPattern)
        .join(" ")
        .replace(cleanupPattern, "");
      return searchPattern.test(str);
    });
  },

  applyAllFilter: function () {
    _mesosStateFiltered = _.clone(this.getLatest());

    if (_filterOptions.searchString !== "") {
      _mesosStateFiltered.frameworks = this.applySearchString(
        _mesosStateFiltered.frameworks,
        _filterOptions.searchString
      );
    }
  },

  // [{
  //   colorIndex: 0,
  //   name: "Marathon",
  //   cpus: [{date: request time, y: value}]
  //   disk: [{date: request time, y: value}]
  //   mem: [{date: request time, y: value}]
  // }]
  getTransposedFrameworks: function () {
    return _.chain(_mesosStates)
      .pluck("frameworks")
      .flatten()
      .groupBy(function (framework) {
        return framework.name;
      }).map(function (framework) {
        return {
          colorIndex: _.first(framework).colorIndex,
          name: _.first(framework).name,
          values: this.createValuesArray(framework)
        };
      }, this).value();
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

  updateTransposed: function () {
    _mesosStatesTransposed.frameworks =
      MesosStateStore.getTransposedFrameworks();
    _mesosStatesTransposed.totalResources =
      _.last(_mesosStates).totalResources;

  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var action = payload.action;
    var data;

    switch (action.type) {
      case ActionTypes.REQUEST_MESOS_STATE:
        data = action.data;
        data.date = Date.now();
        data.frameworks = MesosStateStore.getFrameworks(data);
        data.totalResources = MesosStateStore.sumResources(
          _.pluck(data.slaves, "resources")
        );
        _mesosStates.push(data);
        if (_mesosStates.length > HISTORY_LENGTH) {
          _mesosStates.shift();
        }

        MesosStateStore.applyAllFilter();
        MesosStateStore.updateTransposed();

        MesosStateStore.emitChange();
        break;

      case ActionTypes.FILTER_SERVICES_BY_STRING:
        _filterOptions.searchString = action.data;
        MesosStateStore.applyAllFilter();
    }

    return true;
  })

});

module.exports = MesosStateStore;
