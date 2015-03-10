var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var Config = require("../utils/Config");
var EventTypes = require("../constants/EventTypes");
var MesosStateActions = require("../actions/MesosStateActions");

var _interval;
var _initCalled = false;
var _frameworkIndexes = [];
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
        value: round(value, 2),
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

// [{
//   cpus: [{date: request time, value: absolute, percentage: value}]
//   disk: [{date: request time, value: absolute, percentage: value}]
//   mem: [{date: request time, value: absolute, percentage: value}]
// }]
function getHostResourcesBySlave (slave) {
  return _.reduce(_mesosStates, function (usedResources, state) {
    var tasks = _.chain(state.frameworks)
      .pluck("tasks")
      .flatten()
      .groupBy(function (task) {
        return task.slave_id;
      })
      .value();

    var resources = sumResources(_.pluck(tasks[slave.id], "resources"));

    _.each(resources, function (resourceVal, resourceKey) {
      usedResources[resourceKey].push({
        date: state.date,
        value: resourceVal,
        percentage:
          round(100 * resourceVal / Math.max(1, slave.resources[resourceKey]))
      });
    });
    return usedResources;
  }, {cpus: [], mem: [], disk: []});
}

// [{
//  ...
//  id: "",
//  hostname: "",
//  tasks: {},
//  frameworks: {},
//  used_resources: []
// }]
function getStateByHosts () {
  var data = _.last(_mesosStates);

  var hosts = _.reduce(data.slaves, function (acc, v) {
    acc[v.id] = v;
    acc[v.id].tasks = {};
    acc[v.id].frameworks = {};
    acc[v.id].used_resources = getHostResourcesBySlave(v);
    return acc;
  }, {});

  return _.chain(data.frameworks)
    .map(function (fw) {
      return fw.tasks;
    })
    .flatten()
    .reduce(function (acc, v) {
      acc[v.slave_id].tasks[v.id] = v;
      acc[v.slave_id].frameworks[v.framework_id] = _.find(data.frameworks,
          function (framework) {
        return v.framework_id === framework.id;
      });
      return acc;
    }, hosts)
    .toArray()
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

function filterByString(objects, searchString) {
  var searchPattern = new RegExp(searchString, "i");
  var valuesPattern = /:\"[^\"]+\"/g;
  var cleanupPattern = /[:\"]/g;

  return _.filter(objects, function (obj) {
    var str = JSON.stringify(obj)
      .match(valuesPattern)
      .join(" ")
      .replace(cleanupPattern, "");
    return searchPattern.test(str);
  });
}

function initStates() {
  var currentDate = Date.now();
  // reverse date range!!!
  _mesosStates = _.map(_.range(-Config.historyLength, 0), function (i) {
    return {
      date: currentDate + (i * Config.stateRefresh),
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
    _interval = setInterval(MesosStateActions.fetch, Config.stateRefresh);
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

  getFrameworks: function (filterOptions) {
    var frameworks = getStatesByFramework();

    if (filterOptions && filterOptions.searchString === "") {
      return frameworks;
    }

    return filterByString(frameworks, filterOptions.searchString);
  },

  getHosts: function (filterOptions) {
    var hosts = getStateByHosts();

    if (filterOptions && filterOptions.searchString === "") {
      return hosts;
    }

    return filterByString(hosts, filterOptions.searchString);
  },

  getTasks: function () {
    return getTasksByStatus(this.getLatest().frameworks);
  },

  getTotalResources: function () {
    return getStatesByResource(_mesosStates, "total_resources");
  },

  getAllocResources: function () {
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
    if (_mesosStates.length > Config.historyLength) {
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
