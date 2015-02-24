var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var EventTypes = require("../constants/EventTypes");
var MesosStateActions = require("../actions/MesosStateActions");

var STATE_REFRESH = 2000;
var HISTORY_LENGTH = 30;

var _interval;
var _initCalled = false;
var _mesosStateFiltered = {};
var _filterOptions = {
  searchString: ""
};
var _frameworkIndexes = [];
var _frameworks = [];
var _mesosStates = [];
var _totalResources = {
  cpus: 0,
  disk: 0,
  mem: 0
};

function sumResources(resourceList) {
  return _.reduce(resourceList, function (sumMap, resource) {
    _.each(sumMap, function (value, key) {
      sumMap[key] = value + resource[key];
    });

    return sumMap;
  }, {cpus: 0, mem: 0, disk: 0});
}

// [{
//   cpus: [{date: request time, y: value}]
//   disk: [{date: request time, y: value}]
//   mem: [{date: request time, y: value}]
// }]
function getResourceValues(framework) {
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
}

// [{
//   colorIndex: 0,
//   name: "Marathon",
//   cpus: [{date: request time, y: value}]
//   disk: [{date: request time, y: value}]
//   mem: [{date: request time, y: value}]
// }]
function getFrameworkValues() {
  return _.chain(_mesosStates)
    .pluck("frameworks")
    .flatten()
    .groupBy(function (framework) {
      return framework.name;
    }).map(function (framework) {
      return {
        colorIndex: _.first(framework).colorIndex,
        name: _.first(framework).name,
        values: getResourceValues(framework)
      };
    }, this).value();
}

function fillFramework(name, colorIndex) {
  _.each(_mesosStates, function (state) {
    state.frameworks.push({
      name: name,
      date: state.date,
      colorIndex: colorIndex,
      resources: {cpus: 0, mem: 0, disk: 0}
    });
  });
}

// [{
//   frameworks:[{
//     colorIndex: 0,
//     date: request time,
//     name: "Marathon",
//     resources: {...},
//     ...
//   }]
// ]}]
function normailzeFrameworks(frameworks, date) {
  return _.map(frameworks, function (framework) {
    framework.date = date;
    var index = _.indexOf(_frameworkIndexes, framework.name);
    // this is a new framework, fill in 0s for all the previous datapoints
    if (index === -1) {
      _frameworkIndexes.push(framework.name);
      index = _frameworkIndexes.length - 1;
      fillFramework(framework.name, index);
    }
    // set color index after discovering and assigning index framework
    framework.colorIndex = index;
    return framework;
  });
}

function hasFilter() {
  return _.find(_filterOptions, function (option) {
    return !_.isEmpty(option);
  });
}

function filterFrameworks(frameworks, searchString) {
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
}

function initStates() {
  var currentDate = Date.now();
  // reverse date range!!!
  _mesosStates = _.map(_.range(-HISTORY_LENGTH, 0), function (i) {
    return {
      date: currentDate + (i * STATE_REFRESH),
      frameworks: [],
      slaves: []
    };
  });
}

function startPolling() {
  if (_interval == null) {
    MesosStateActions.fetch();
    _interval = setInterval(MesosStateActions.fetch, STATE_REFRESH);
  }
}

function stopPolling() {
  if (_interval != null) {
    clearInterval(_interval);
    _interval = null;
  }
}

var MesosStateStore = _.extend({}, EventEmitter.prototype, {

  init: function () {
    if (_initCalled) {
      return;
    }

    _initCalled = true;

    initStates();
    startPolling();
  },

  getAll: function () {
    return _mesosStates;
  },

  getLatest: function () {
    return _.last(_mesosStates);
  },

  getFrameworks: function () {
    return _frameworks;
  },

  getFiltered: function () {
    if (hasFilter()) {
      return _mesosStateFiltered;
    }
    return this.getLatest();
  },

  getTotalResources: function () {
    return _totalResources;
  },

  getFilterOptions: function () {
    return _filterOptions;
  },

  applyAllFilter: function () {
    _mesosStateFiltered = _.clone(this.getLatest());

    if (_filterOptions.searchString !== "") {
      _mesosStateFiltered.frameworks = filterFrameworks(
        _mesosStateFiltered.frameworks,
        _filterOptions.searchString
      );
    }

    this.emitChange(EventTypes.MESOS_STATE_CHANGE);
  },

  emitChange: function (eventName) {
    this.emit(eventName);
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
    if (eventName === EventTypes.MESOS_STATE_CHANGE &&
      _.isEmpty(this.listeners(EventTypes.MESOS_STATE_CHANGE))) {
      stopPolling();
    }
  },

  updateFrameworks: function () {
    if (!_.isEmpty(this.listeners(EventTypes.MESOS_STATE_FRAMEWORKS_CHANGE))) {
      _frameworks = getFrameworkValues();
      this.emitChange(EventTypes.MESOS_STATE_FRAMEWORKS_CHANGE);
    }
  },

  processState: function (data) {
    data.date = Date.now();
    data.frameworks = normailzeFrameworks(data.frameworks, data.date);
    _totalResources = sumResources(
      _.pluck(data.slaves, "resources")
    );
    _mesosStates.push(data);
    if (_mesosStates.length > HISTORY_LENGTH) {
      _mesosStates.shift();
    }

    this.applyAllFilter();
    this.updateFrameworks();
    this.emitChange(EventTypes.MESOS_STATE_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_MESOS_STATE:
        MesosStateStore.processState(action.data);
        break;
      case ActionTypes.REQUEST_MESOS_STATE_FRAMEWORKS:
        MesosStateStore.updateFrameworks();
        break;
      case ActionTypes.FILTER_SERVICES_BY_STRING:
        _filterOptions.searchString = action.data;
        MesosStateStore.applyAllFilter();
        break;
    }

    return true;
  })

});

module.exports = MesosStateStore;
