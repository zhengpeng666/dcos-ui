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
var _colorIndexes = [];
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
    var frameworks = _.map(data.frameworks, function (fw) {
      fw.date = data.date;
      var i = _.indexOf(_colorIndexes, fw.name);
      // This is a new framework, fill in 0s for all the previous datapoints.
      if (i === -1) {
        _colorIndexes.push(fw.name);
        i = _colorIndexes.length - 1;
        this.fillFramework(fw.name, i);
      }
      fw.colorIndex = i;
      return fw;
    }, this);

    return frameworks;
  },

  // [{
  //   cpus: [{data: request time, y: value}]
  //   disk: [{data: request time, y: value}]
  //   mem: [{data: request time, y: value}]
  // }]
  createValuesArray: function (fw) {
    var values = {"cpus": [], "disk": [], "mem": []};
    return _.reduce(values, function (acc, arr, r) {
      _.map(fw, function (v) {
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
  //   cpus: [{data: request time, y: value}]
  //   disk: [{data: request time, y: value}]
  //   mem: [{data: request time, y: value}]
  // }]
  getTransposedFrameworks: function () {
    return _.chain(_mesosStates)
      .pluck("frameworks")
      .flatten()
      .groupBy(function (fw) {
        return fw.name;
      }).map(function (fw) {
        return {
          colorIndex: _.first(fw).colorIndex,
          name: _.first(fw).name,
          values: this.createValuesArray(fw)
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
