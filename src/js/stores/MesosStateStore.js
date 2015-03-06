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
var _pagetype = "Default";
var _filterOptions = {};
_filterOptions[_pagetype] = {
  searchString: ""
};
var _frameworkIndexes = [];
var _frameworksFiltered = [];
var _mesosStates = [];

function round(value, decimalPlaces) {
  decimalPlaces || (decimalPlaces = 0);
  var factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
}

/* jshint camelcase:false */
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
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
function getStatesByResource(list, resourcesKey) {
  var values = {"cpus": [], "disk": [], "mem": []};
  return _.foldl(values, function (acc, arr, r) {
    _.each(list, function (v, i) {
      var value = v[resourcesKey][r];
      var max = Math.max(1, _mesosStates[i].total_resources[r]);
      acc[r].push({
        date: v.date,
        value: round(value),
        percentage: round(100 * value / max)
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
function getStatesByFramework() {
  return _.chain(_mesosStates)
    .pluck("frameworks")
    .flatten()
    .groupBy(function (framework) {
      return framework.id;
    }).map(function (framework) {
      return _.extend(_.clone(_.last(framework)), {
        used_resources: getStatesByResource(framework, "used_resources")
      });
    }, this).value();
}

function fillFramework(id, name, colorIndex) {
  _.each(_mesosStates, function (state) {
    state.frameworks.push({
      active: false,
      id: id,
      name: name,
      date: state.date,
      colorIndex: colorIndex,
      resources: {cpus: 0, mem: 0, disk: 0},
      used_resources: {cpus: 0, mem: 0, disk: 0},
      tasks: []
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
function normalizeFrameworks(frameworks, date) {
  return _.map(frameworks, function (framework) {
    framework.date = date;
    var index = _.indexOf(_frameworkIndexes, framework.name);
    // this is a new framework, fill in 0s for all the previous datapoints
    if (index === -1) {
      _frameworkIndexes.push(framework.name);
      index = _frameworkIndexes.length - 1;
      fillFramework(framework.id, framework.name, index);
    }
    // set color index after discovering and assigning index framework
    framework.colorIndex = index;
    return framework;
  });
}

function hasFilter() {
  return _.find(_filterOptions[_pagetype], function (option) {
    return !_.isEmpty(option);
  });
}

function filterFrameworks(searchString) {
  var searchPattern = new RegExp(searchString, "i");
  var valuesPattern = /:\"[^\"]+\"/g;
  var cleanupPattern = /[:\"]/g;

  return _.filter(getStatesByFramework(), function (framework) {
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
      slaves: [],
      used_resources: {cpus: 0, mem: 0, disk: 0},
      total_resources: {cpus: 0, mem: 0, disk: 0}
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

function setPageType (pagetype) {
  _pagetype = pagetype;
  if (_filterOptions[_pagetype] === undefined) {
    _filterOptions[_pagetype] = _.clone(_filterOptions.Default);
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
    if (hasFilter()) {
      return _frameworksFiltered;
    }
    return getStatesByFramework();
  },

  getTotalResources: function () {
    return getStatesByResource(_mesosStates, "total_resources");
  },

  getUsedResources: function () {
    return getStatesByResource(_mesosStates, "used_resources");
  },

  getFilterOptions: function () {
    return _filterOptions[_pagetype];
  },

  applyAllFilter: function () {
    if (_filterOptions[_pagetype].searchString !== "") {
      _frameworksFiltered = filterFrameworks(
        _filterOptions[_pagetype].searchString
      );
    }
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

  processFilter: function (searchString) {
    _filterOptions[_pagetype].searchString = searchString;
    this.applyAllFilter();
    this.emitChange(EventTypes.MESOS_STATE_CHANGE);
  },

  processState: function (data) {
    data.date = Date.now();
    data.frameworks = normalizeFrameworks(data.frameworks, data.date);
    data.total_resources = sumResources(
      _.pluck(data.slaves, "resources")
    );
    data.used_resources = sumResources(
      _.pluck(data.frameworks, "used_resources")
    );
    _mesosStates.push(data);
    if (_mesosStates.length > HISTORY_LENGTH) {
      _mesosStates.shift();
    }

    this.applyAllFilter();

    this.emitChange(EventTypes.MESOS_STATE_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_MESOS_STATE:
        MesosStateStore.processState(action.data);
        break;
      case ActionTypes.FILTER_SERVICES_BY_STRING:
        MesosStateStore.processFilter(action.data);
        break;
      case ActionTypes.SET_PAGETYPE:
        setPageType(action.data);
        break;
    }

    return true;
  })

});
/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
/* jshint camelcase:true */

module.exports = MesosStateStore;
