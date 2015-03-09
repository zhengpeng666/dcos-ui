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
var _frameworkIndexes = [];
var _hosts = [];
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

function getResourceByHost(list, slave) {
  var values = {"cpus": [], "disk": [], "mem": []};
  return _.foldl(values, function (acc, arr, r) {
    _.each(list, function (v, i) {
      var value = 0;
      var percentage = 0;

      if (v != null) {
        value = v[r];
      }

      var matchedSlave = _.find(_mesosStates[i].slaves, function (s) {
        return s.id === slave.id;
      });

      if (matchedSlave != null) {
        percentage =
          round(100 * value / Math.max(1, matchedSlave.resources[r]));
      }

      acc[r].push({
        date: _mesosStates[i].date,
        value: round(value),
        percentage: percentage
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
    })
    .map(function (framework) {
      return _.extend(_.clone(_.last(framework)), {
        used_resources: getStatesByResource(framework, "used_resources")
      });
    }, this).value();
}

// [{
//   state: "TASK_RUNNING",
//   tasks: [{
//     executor_id: 0,
//     framework_id: "askdfjaalsjf",
//     id: "askdfja",
//     name: "datanode",
//     resources: {mem: 0, cpus: 0, disk: 0},
//     state: "TASK_RUNNING"
//   }, ...]
// }]
function getTasksByStatus(frameworks) {
  return _.chain(frameworks)
    .pluck("tasks")
    .flatten()
    .groupBy(function (task) {
      return task.state;
    })
    .map(function (tasks, value) {
      return {
        state: value,
        tasks: tasks
      };
    })
    .value();
}

function getResourcesBySlave() {
  return _.map(_mesosStates, function (state) {
    return _.chain(state.frameworks)

      // Will pass a framework filter on this place

      .pluck("tasks")
      .flatten()
      .groupBy(function (task) {
        return task.slave_id;
      })
      .reduce(function (slave, tasks, slaveid) {
        slave[slaveid] = sumResources(_.pluck(tasks, "resources"));
        return slave;
      }, {})
      .value();
  });
}

function getStatesByHost(frameworks) {
  var usedResources = getResourcesBySlave();

  return _.chain(_mesosStates)
    .pluck("slaves")
    .flatten()
    .groupBy(function (slave) {
      return slave.id;
    })
    .map(function (slave) {
      var last = _.clone(_.last(slave));

      var matchedFrameworks = _.filter(frameworks, function (framework) {
        return _.find(framework.tasks, function (task) {
          return task.slave_id === last.id;
        });
      });

      return _.extend(last, {
        frameworks: matchedFrameworks,
        used_resources: getResourceByHost(_.pluck(usedResources, last.id), last)
      });
    }, this)
    .value();
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

function filterFrameworks(options) {
  if (options.searchString === "") {
    return getStatesByFramework();
  }

  var searchPattern = new RegExp(options.searchString, "i");
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

  getFilteredFrameworks: function (options) {
    return filterFrameworks(options);
  },

  getFrameworks: function () {
    return getStatesByFramework();
  },

  getHosts: function () {
    return getStatesByHost();
  },

  getTasks: function () {
    return getTasksByStatus(this.getLatest().frameworks);
  },

  getTotalResources: function () {
    return getStatesByResource(_mesosStates, "total_resources");
  },

  getUsedResources: function () {
    return getStatesByResource(_mesosStates, "used_resources");
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

    this.emitChange(EventTypes.MESOS_STATE_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_MESOS_STATE:
        MesosStateStore.processState(action.data);
        break;
    }

    return true;
  })

});
/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
/* jshint camelcase:true */

module.exports = MesosStateStore;
