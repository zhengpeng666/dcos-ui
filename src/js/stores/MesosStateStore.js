var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var Config = require("../utils/Config");
var EventTypes = require("../constants/EventTypes");
var HealthTypes = require("../constants/HealthTypes");
var Maths = require("../utils/Maths");
var MesosStateActions = require("../events/MesosStateActions");
var Strings = require("../utils/Strings");

var _failureRates = [];
var _prevMesosStatusesMap = {};

var _frameworkIndexes = [];
var _frameworkHealth = {};
var _healthProcessed = false;
var _loading;
var _interval;
var _initCalledAt;
var _marathonUrl;
var _mesosStates = [];
var _statesProcessed = false;

var NA_HEALTH = {key: "NA", value: HealthTypes.NA};

function setHostsToFrameworkCount(frameworks, hosts) {
  return _.map(frameworks, function (framework) {
    framework.slaves_count = _.foldl(hosts, function (acc, host) {
      if (host.frameworks[framework.id] != null) {
        acc++;
      }
      return acc;
    }, 0);
    return framework;
  });
}

function sumResources(resourceList) {
  return _.foldl(resourceList, function (sumMap, resource) {
    _.each(sumMap, function (value, key) {
      sumMap[key] = value + resource[key];
    });

    return sumMap;
  }, {cpus: 0, mem: 0, disk: 0});
}

// [{
//   cpus: [{date: request time, value: value, percentage: value}]
//   disk: [{date: request time, value: value, percentage: value}]
//   mem: [{date: request time, value: value, percentage: value}]
// }]
function sumFrameworkResources(frameworks) {
  return _.foldl(frameworks, function (sumMap, framework) {
    _.each(sumMap, function (value, key) {
      var values = framework.used_resources[key];
      _.each(values, function (val, i) {
        if (value[i] == null) {
          value.push({date: val.date});
          value[i].value = 0;
          value[i].percentage = 0;
        }
        value[i].value += val.value;
        value[i].percentage += val.percentage;
      });
    });

    return sumMap;
  }, {cpus: [], mem: [], disk: []});
}

// [{
//   cpus: [{date: request time, value: value, percentage: value}]
//   disk: [{date: request time, value: value, percentage: value}]
//   mem: [{date: request time, value: value, percentage: value}]
// }]
function sumHostResources(hosts) {
  return _.foldl(hosts, function (sumMap, host) {
    _.each(sumMap, function (value, key) {
      var values = host.used_resources[key];
      _.each(values, function (val, i) {
        var max = Math.max(1, _mesosStates[i].total_resources[key]);
        if (value[i] == null) {
          value.push({date: val.date});
          value[i].value = 0;
        }
        value[i].value += val.value;
        value[i].percentage = Maths.round(100 * value[i].value / max);
      });
    });

    return sumMap;
  }, {cpus: [], mem: [], disk: []});
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
        value: Maths.round(value, 2),
        percentage: Maths.round(100 * value / max)
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
      var lastFramework = _.clone(_.last(framework));
      return _.extend(lastFramework, {
        used_resources: getStatesByResource(framework, "used_resources"),
        tasks_count: lastFramework.tasks.length
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
function getTasksByStatus(frameworks, taskTypes) {
  if (!taskTypes || frameworks.length === 0) {
    return [];
  }

  // Loop through all frameworks
  var data = _.foldl(frameworks, function (types, framework) {
    // Loop through the requested taskTypes
    taskTypes.forEach(function (taskType) {
      if (framework[taskType] == null ||
        framework[taskType].length === 0) {
        return types;
      }

      // Loop through tasks in for the task type
      framework[taskType].forEach(function (task) {
        var state = task.state;
        if (types[state] == null) {
          types[state] = {
            state: state,
            tasks: []
          };
        }

        types[state].tasks.push(task);
      });
    });

    return types;
  }, {});

  return _.values(data);
}

// Caluculate a failure rate
function getFailureRate (mesosState, taskTypes) {
  var newMesosStatusesMap = {};
  var statuses = getTasksByStatus(mesosState.frameworks, taskTypes);
  var failed = 0;
  var successful = 0;
  var diff = {};

  statuses.forEach(function (status) {
    // Map task statuses to statuses hash map
    _.foldl(status.tasks, function (memo, task) {
      memo[task.id] = task.statuses;
      return memo;
    }, newMesosStatusesMap);
  });

  // Only compute diff if we have previous data
  if (Object.keys(_prevMesosStatusesMap).length) {
    // Find diff
    diff = _.foldl(newMesosStatusesMap, function (memo, status, key) {
      if (status.length === 0) {
        return memo;
      }

      // This assumes the previous status is equal to the current one
      if (this[key] && status.length === this[key].length) {
        return memo;
      }

      var finalState = _.max(status, function (state) {
        return state.timestamp;
      });

      if (!memo[finalState.state]) {
        memo[finalState.state] = 0;
      }

      memo[finalState.state]++;

      return memo;
    }, {}, _prevMesosStatusesMap);

    // refs: https://github.com/apache/mesos/blob/master/include/mesos/mesos.proto
    successful = (diff.TASK_STAGING || 0) +
      (diff.TASK_STARTING || 0) +
      (diff.TASK_RUNNING || 0) +
      (diff.TASK_FINISHED || 0);
    failed = (diff.TASK_FAILED || 0) +
      (diff.TASK_LOST || 0) +
      (diff.TASK_ERROR || 0);
  }

  // Set for next request
  _prevMesosStatusesMap = newMesosStatusesMap;

  return {
    date: mesosState.date,
    rate: (failed / (failed + successful)) * 100 | 0
  };
}

function getAllFailureRates (list, taskTypes) {
  var failureRate = getFailureRate(_.last(list), taskTypes);
  _failureRates.push(failureRate);
  _failureRates.shift();
  return _failureRates;
}

// [{
//   cpus: [{date: request time, value: absolute, percentage: value}]
//   disk: [{date: request time, value: absolute, percentage: value}]
//   mem: [{date: request time, value: absolute, percentage: value}]
// }]
function getHostResourcesBySlave (slave) {
  return _.foldl(_mesosStates, function (usedResources, state) {
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
          Maths.round(
            100 * resourceVal / Math.max(1, slave.resources[resourceKey])
          )
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

  var hosts = _.foldl(data.slaves, function (acc, v) {
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
    .foldl(function (acc, v) {
      acc[v.slave_id].tasks[v.id] = v;
      acc[v.slave_id].frameworks[v.framework_id] = _.find(data.frameworks,
          function (framework) {
        return v.framework_id === framework.id;
      });
      return acc;
    }, hosts)
    .each(function (slave) {
      slave.tasks_count = _.size(slave.tasks);
    })
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
      tasks: [],
      health: NA_HEALTH
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
    if (framework.name.toLowerCase().indexOf("marathon") > -1 &&
        framework.webui_url != null) {
      _marathonUrl = Strings.ipToHostName(framework.webui_url);
    }
    // this is a new framework, fill in 0s for all the previous datapoints
    if (index === -1) {
      _frameworkIndexes.push(framework.name);
      index = _frameworkIndexes.length - 1;
      fillFramework(framework.id, framework.name, index);
    }
    // set color index after discovering and assigning index framework
    framework.colorIndex = index;
    framework.health = _frameworkHealth[framework.name] || NA_HEALTH;
    return framework;
  });
}

function filterByString(objects, key, searchString) {
  var searchPattern = new RegExp(Strings.escapeForRegExp(searchString), "i");

  return _.filter(objects, function (obj) {
    return searchPattern.test(obj[key]);
  });
}

function filterByHealth(objects, healthFilter) {
  return _.filter(objects, function (obj) {
    return obj.health.value === healthFilter;
  });
}

function filterHostsByService(hosts, frameworkId) {
  return _.filter(hosts, function (host) {
    return host.frameworks[frameworkId] != null;
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

  _failureRates = _.map(_.range(-Config.historyLength, 0), function (i) {
    return {
      date: currentDate + (i * Config.stateRefresh),
      rate: 0
    };
  });
}

function fetchData() {
  if (!_.isEmpty(_marathonUrl)) {
    MesosStateActions.fetchMarathonHealth(_marathonUrl);
  }
  MesosStateActions.fetch();
}

function startPolling() {
  if (_interval == null) {
    fetchData();
    _interval = setInterval(fetchData, Config.stateRefresh);
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
    if (_initCalledAt != null) {
      return;
    }

    // log when we started calling
    _initCalledAt = _.now();

    initStates();
  },

  getRefreshRate: function () {
    return Config.stateRefresh;
  },

  getAll: function () {
    return _mesosStates;
  },

  getLatest: function () {
    return _.last(_mesosStates);
  },

  getFrameworks: function (filterOptions) {
    filterOptions = filterOptions || {};
    var frameworks = getStatesByFramework();

    if (filterOptions) {
      if (filterOptions.healthFilter != null) {
        frameworks = filterByHealth(frameworks, filterOptions.healthFilter);
      }

      if (filterOptions.searchString !== "") {
        frameworks = filterByString(frameworks,
          "name",
          filterOptions.searchString
        );
      }
    }

    return frameworks;
  },

  getFrameworkHealth: function () {
    return _.values(_frameworkHealth);
  },

  getTotalFrameworksResources: function (frameworks) {
    return sumFrameworkResources(frameworks);
  },

  getTotalHostsResources: function (hosts) {
    return sumHostResources(hosts);
  },

  getFrameworksWithHostsCount: function (hosts) {
    return setHostsToFrameworkCount(this.getLatest().frameworks, hosts);
  },

  getHosts: function (filterOptions) {
    filterOptions = filterOptions || {};
    var hosts = getStateByHosts();

    if (filterOptions) {
      if (filterOptions.byServiceFilter != null) {
        hosts = filterHostsByService(hosts, filterOptions.byServiceFilter);
      }

      if (filterOptions.searchString !== "") {
        hosts = filterByString(hosts,
          "hostname",
          filterOptions.searchString
        );
      }
    }

    return hosts;
  },

  getStatesProcessed: function () {
    return _statesProcessed;
  },

  getHealthProcessed: function () {
    return _healthProcessed;
  },

  getTasks: function () {
    return getTasksByStatus(this.getLatest().frameworks, ["tasks"]);
  },

  getTaskFailureRate: function () {
    return getAllFailureRates(_mesosStates, ["tasks", "completed_tasks"]);
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
    startPolling();
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
    if (eventName === EventTypes.MESOS_STATE_CHANGE &&
      _.isEmpty(this.listeners(EventTypes.MESOS_STATE_CHANGE))) {
      stopPolling();
    }
  },

  updateStateProcessed: function () {
    _statesProcessed = true;
    this.emitChange(EventTypes.MESOS_STATE_CHANGE);
  },

  notifyStateProcessed: function () {
    // skip id state is processed, already loading or init has not been called
    if (_statesProcessed || _loading != null || _initCalledAt == null) {
      this.emitChange(EventTypes.MESOS_STATE_CHANGE);
      return;
    }

    var msLeftOfDelay = Config.stateLoadDelay - (_.now() - _initCalledAt);
    if (msLeftOfDelay < 0) {
      this.updateStateProcessed();
    } else {
      _loading = setTimeout(
        this.updateStateProcessed.bind(this),
        msLeftOfDelay
      );
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

    this.notifyStateProcessed();
  },

  processStateError: function () {
    this.emitChange(EventTypes.MESOS_STATE_REQUEST_ERROR);
  },

  processMarathonHealth: function (data) {
    _frameworkHealth = _.foldl(data.apps, function (curr, app) {
      if (!(app.labels.DCOS_PACKAGE_IS_FRAMEWORK &&
          app.labels.DCOS_PACKAGE_IS_FRAMEWORK.toLowerCase() === "true") ||
          app.healthChecks == null ||
          app.healthChecks.length === 0) {
        return curr;
      }

      // find the framework based on package name
      var frameworkName = _.find(_frameworkIndexes, function (name) {
        return name.indexOf(app.labels.DCOS_PACKAGE_NAME) > -1;
      });

      if (frameworkName == null) {
        return curr;
      }

      var health = {key: "IDLE", value: HealthTypes.IDLE};
      if (app.tasksHealthy === app.tasksRunning) {
        health = {key: "HEALTHY", value: HealthTypes.HEALTHY};
      }
      if (app.tasksUnhealthy > 0) {
        health = {key: "UNHEALTHY", value: HealthTypes.UNHEALTHY};
      }

      curr[frameworkName] = health;

      return curr;
    }, {});

    _healthProcessed = true;

    this.emitChange(EventTypes.MARATHON_HEALTH_CHANGE);
  },

  processMarathonHealthError: function () {
    _healthProcessed = true;

    this.emitChange(EventTypes.MARATHON_HEALTH_REQUEST_ERROR);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    var action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_MESOS_STATE_SUCCESS:
        MesosStateStore.processState(action.data);
        break;
      case ActionTypes.REQUEST_MESOS_STATE_ERROR:
        MesosStateStore.processStateError();
        break;
      case ActionTypes.REQUEST_MARATHON_HEALTH_SUCCESS:
        MesosStateStore.processMarathonHealth(action.data);
        break;
      case ActionTypes.REQUEST_MARATHON_HEALTH_ERROR:
        MesosStateStore.processMarathonHealthError();
        break;
    }

    return true;
  })

});

module.exports = MesosStateStore;
