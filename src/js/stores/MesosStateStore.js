var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var Config = require("../config/Config");
var EventTypes = require("../constants/EventTypes");
var HealthTypes = require("../constants/HealthTypes");
var Maths = require("../utils/Maths");
var MesosStateActions = require("../events/MesosStateActions");
var Strings = require("../utils/Strings");

var _failureRates = [];
var _prevMesosStatusesMap = {};

var _appsProcessed = false;
var _frameworkNames = [];
var _frameworkIDs = [];
var _frameworkImages = {};
var _frameworkHealth = {};
var _loading;
var _interval;
var _initCalledAt;
var _mesosStates = [];
var _statesProcessed = false;

var NA_HEALTH = {key: "NA", value: HealthTypes.NA};
var NA_IMAGES = {
  "icon-small": "./img/services/icon-service-default-small@2x.png",
  "icon-medium": "./img/services/icon-service-default-medium@2x.png",
  "icon-large": "./img/services/icon-service-default-large@2x.png"
};

function setHostsToFrameworkCount(frameworks) {
  return _.map(frameworks, function (framework) {
    framework.slaves_count = framework.slave_ids.length;
    return framework;
  });
}

function sumResources(resourceList) {
  return _.foldl(resourceList, function (memo, resource) {
    _.each(memo, function (value, key) {
      memo[key] = value + resource[key];
    });

    return memo;
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
  return _.foldl(hosts, function (memo, host) {
    _.each(memo, function (value, key) {
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

    return memo;
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

function getFrameworksTaskTotals(frameworks) {
  if (frameworks.length === 0) {
    return {};
  }

  var tasks = {
    TASK_STAGING: 0,
    TASK_STARTING: 0,
    TASK_RUNNING: 0,
    TASK_FINISHED: 0,
    TASK_FAILED: 0,
    TASK_LOST: 0,
    TASK_ERROR: 0
  };
  var taskTypes = Object.keys(tasks);

  // Loop through all frameworks
  frameworks.forEach(function (framework) {
    taskTypes.forEach(function (taskType) {
      if (framework[taskType]) {
        tasks[taskType] += framework[taskType];
      }
    });
  });

  return tasks;
}

// Caluculate a failure rate
function getFailureRate(mesosState) {
  var failed = 0;
  var successful = 0;
  var diff = {};

  var newMesosStatusesMap = getFrameworksTaskTotals(mesosState.frameworks);

  // Only compute diff if we have previous data

  var keys = Object.keys(newMesosStatusesMap);
  if (keys.length) {
    keys.forEach(function (key) {
      diff[key] = newMesosStatusesMap[key] - (_prevMesosStatusesMap[key] || 0);
    });

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

function getAllFailureRates(list) {
  var failureRate = getFailureRate(_.last(list));
  _failureRates.push(failureRate);
  _failureRates.shift();
  return _failureRates;
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
        used_resources: getStatesByResource(framework, "used_resources")
      });
    }, this).value();
}

// [{
//   cpus: [{date: request time, value: absolute, percentage: value}]
//   disk: [{date: request time, value: absolute, percentage: value}]
//   mem: [{date: request time, value: absolute, percentage: value}]
// }]
function getHostResourcesBySlave(slave) {
  return _.foldl(_mesosStates, function (memo, state) {
    var foundSlave = _.findWhere(state.slaves, {id: slave.id});
    var resources;

    if (foundSlave && foundSlave.used_resources) {
      resources = _.pick(foundSlave.used_resources, "cpus", "mem", "disk");
    } else {
      resources = {cpus: 0, mem: 0, disk: 0};
    }

    _.each(resources, function (resourceVal, resourceKey) {
      memo[resourceKey].push({
        date: state.date,
        value: resourceVal,
        percentage:
          Maths.round(
            100 * resourceVal / Math.max(1, slave.resources[resourceKey])
          )
      });
    });
    return memo;
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
function getStateByHosts() {
  var data = _.last(_mesosStates);

  return _.map(data.slaves, function (slave) {
    var _return = _.clone(slave);
    _return.used_resources = getHostResourcesBySlave(slave);

    return _return;
  });
}

function addFrameworkToPreviousStates(_framework, colorIndex) {
  _.each(_mesosStates, function (state) {
    // We could optimize here by moving this line out of the `each`
    // this would mean that all states have the same instance of
    // the object
    var framework = _.clone(_framework);

    _.extend(framework, {
      date: state.date,
      colorIndex: colorIndex,
      slave_ids: [],
      offered_resources: {cpus: 0, disk: 0, mem: 0},
      used_resources: {cpus: 0, disk: 0, mem: 0},
      TASK_ERROR: 0,
      TASK_FAILED: 0,
      TASK_FINISHED: 0,
      TASK_KILLED: 0,
      TASK_LOST: 0,
      TASK_RUNNING: 0,
      TASK_STAGING: 0,
      TASK_STARTING: 0
    });

    state.frameworks.push(framework);
  });
}

function getActiveSlaves(slaves) {
  return _.where(slaves, {active: true});
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
    var index = _.indexOf(_frameworkIDs, framework.id);
    framework.date = date;

    // this is a new framework, fill in 0s for all the previous datapoints
    if (index === -1) {
      _frameworkIDs.push(framework.id);
      _frameworkNames.push(framework.name);
      index = _frameworkIDs.length - 1;
      addFrameworkToPreviousStates(framework, index);
    }
    // set color index after discovering and assigning index framework
    framework.colorIndex = index;
    framework.health = _frameworkHealth[framework.name] || NA_HEALTH;
    framework.images = _frameworkImages[framework.name] || NA_IMAGES;

    return framework;
  });
}

function getFrameworkHealth(app) {
  if (app.healthChecks == null || app.healthChecks.length === 0) {
    return null;
  }

  var health = {key: "IDLE", value: HealthTypes.IDLE};
  if (app.tasksUnhealthy > 0) {
    health = {key: "UNHEALTHY", value: HealthTypes.UNHEALTHY};
  } else if (app.tasksRunning > 0 && app.tasksHealthy === app.tasksRunning) {
    health = {key: "HEALTHY", value: HealthTypes.HEALTHY};
  }

  return health;
}

function activeHostsCountOverTime() {
  return _.map(_mesosStates, function (state) {
    return {
      date: state.date,
      slavesCount: state.active_slaves || 0
    };
  });
}

function parseMetadata(b64Data) {
  // extract content of the DCOS_PACKAGE_METADATA label
  try {
    var dataAsJsonString = global.atob(b64Data);
    return JSON.parse(dataAsJsonString);
  } catch (error) {
    return {};
  }
}

function getFrameworkImages(app) {
  if (app.labels == null ||
    app.labels.DCOS_PACKAGE_METADATA == null ||
    app.labels.DCOS_PACKAGE_METADATA.length === 0) {
    return null;
  }

  var metadata = parseMetadata(app.labels.DCOS_PACKAGE_METADATA);

  if (metadata.images == null ||
      metadata.images["icon-small"].length === 0 ||
      metadata.images["icon-medium"].length === 0 ||
      metadata.images["icon-large"].length === 0) {
    return NA_IMAGES;
  }

  return metadata.images;
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
    return _.contains(host.framework_ids, frameworkId);
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
      total_resources: {cpus: 0, mem: 0, disk: 0},
      active_slaves: 0
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
  MesosStateActions.fetch();
  MesosStateActions.fetchMarathonHealth();
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
    _initCalledAt = Date.now();

    initStates();
  },

  reset: function () {
    _failureRates = [];
    _prevMesosStatusesMap = {};

    _appsProcessed = false;
    _frameworkNames = [];
    _frameworkIDs = [];
    _frameworkHealth = {};
    _loading = undefined;
    _interval = undefined;
    _initCalledAt = undefined;
    _mesosStates = [];
    _statesProcessed = false;

    NA_HEALTH = {key: "NA", value: HealthTypes.NA};
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

  getActiveHostsCount: function () {
    return activeHostsCountOverTime();
  },

  isStatesProcessed: function () {
    return _statesProcessed;
  },

  isAppsProcessed: function () {
    return _appsProcessed;
  },

  getTaskTotals: function () {
    return getFrameworksTaskTotals(this.getLatest().frameworks);
  },

  getTaskFailureRate: function () {
    return getAllFailureRates(_mesosStates);
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

    var msLeftOfDelay = Config.stateLoadDelay - (Date.now() - _initCalledAt);
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
    data.total_resources = sumResources(_.pluck(data.slaves, "resources"));
    data.used_resources = sumResources(
      _.pluck(data.frameworks, "used_resources")
    );
    data.active_slaves = getActiveSlaves(data.slaves).length;

    // Add new snapshot
    _mesosStates.push(data);
    // Remove oldest snapshot when we have more than we should
    if (_mesosStates.length > Config.historyLength) {
      _mesosStates.shift();
    }

    this.notifyStateProcessed();
  },

  processStateError: function () {
    this.emitChange(EventTypes.MESOS_STATE_REQUEST_ERROR);
  },

  processMarathonApps: function (data) {
    var frameworkData = _.foldl(data.apps, function (curr, app) {
      if (app.labels.DCOS_PACKAGE_IS_FRAMEWORK == null ||
          app.labels.DCOS_PACKAGE_IS_FRAMEWORK.toLowerCase() !== "true") {
        return curr;
      }

      // find the framework based on package name
      var frameworkName = _.find(_frameworkNames, function (name) {
        if (name.length) {
          name = name.toLowerCase();
        }

        var packageName = app.labels.DCOS_PACKAGE_NAME;

        if (packageName.length) {
          packageName = packageName.toLowerCase();
        }

        return name.indexOf(packageName) > -1;
      });

      if (frameworkName == null) {
        return curr;
      }

      curr.health[frameworkName] = getFrameworkHealth(app);
      curr.images[frameworkName] = getFrameworkImages(app);

      return curr;
    }, {health: {}, images: {}});

    _frameworkHealth = frameworkData.health;
    _frameworkImages = frameworkData.images;

    _appsProcessed = true;

    this.emitChange(EventTypes.MARATHON_APPS_CHANGE);
  },

  processMarathonAppsError: function () {
    _appsProcessed = true;

    this.emitChange(EventTypes.MARATHON_APPS_REQUEST_ERROR);
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
      case ActionTypes.REQUEST_MARATHON_APPS_SUCCESS:
        MesosStateStore.processMarathonApps(action.data);
        break;
      case ActionTypes.REQUEST_MARATHON_APPS_ERROR:
        MesosStateStore.processMarathonAppsError();
        break;
    }

    return true;
  })

});

module.exports = MesosStateStore;

// TODO (DCOS-1148): wrap this in a check for when we are running tests
module.exports.parseMetadata = parseMetadata;
module.exports.getFrameworkImages = getFrameworkImages;
module.exports.NA_IMAGES = NA_IMAGES;
