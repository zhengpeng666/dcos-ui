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
var TimeScales = require("../constants/TimeScales");

var _failureRates = [];
var _prevMesosStatusesMap = {};

var _appsProcessed = false;
var _frameworkNames = [];
var _frameworkIDs = [];
var _frameworkImages = {};
var _frameworkHealth = {};
var _loading;
var _intervals = {};
var _initCalledAt;
var _mesosStates = [];
var _lastMesosState = {};
var _statesProcessed = false;

var NA_HEALTH = {key: "NA", value: HealthTypes.NA};
var NA_IMAGES = {
  "icon-small": "./img/services/icon-service-default-small@2x.png",
  "icon-medium": "./img/services/icon-service-default-medium@2x.png",
  "icon-large": "./img/services/icon-service-default-large@2x.png"
};
var MARATHON_IMAGES = {
  "icon-small": "./img/services/icon-service-marathon-small@2x.png",
  "icon-medium": "./img/services/icon-service-marathon-medium@2x.png",
  "icon-large": "./img/services/icon-service-marathon-large@2x.png"
};

function setHostsToFrameworkCount(frameworks) {
  return _.map(frameworks, function (framework) {
    if (framework.slave_ids == null) {
      framework.slave_ids = [];
    }
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

/*
 * @param {Array} List of elements with a resources object,
 * each holding an array of time steps (states by element)
 * @return {Object} Each resource in the object holds a list of
 * time steps with summed resources of the provided list
 * {
 *   cpus: [
 *     {date: request time, value: total cpus, percentage: of total_resources},
 *     ...
 *   ],
 *   disk: [
 *     {date: request time, value: total disk, percentage: of total_resources},
 *     ...
 *   ]
 *   mem: [
 *     {date: request time, value: total mem, percentage: of total_resources},
 *     ...
 *   ]
 * }
 */
function sumListResources(list, resourcesKey) {
  return _.foldl(list, function (memo, element) {
    _.each(memo, function (value, key) {
      var values = element[resourcesKey][key];
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

/*
 * @param {Array} List of time steps with a resources object,
 * each holding a resource value of that time step (elements by state)
 * @return {Object} each resource in the object holds a list of
 * time steps with resources of the provided list
 * {
 *   cpus: [
 *     {date: request time, value: cpus, percentage: of total_resources},
 *     ...
 *   ],
 *   disk: [
 *     {date: request time, value: disk, percentage: of total_resources},
 *     ...
 *   ]
 *   mem: [
 *     {date: request time, value: mem, percentage: of total_resources},
 *     ...
 *   ]
 * }
 */
function getStatesByResource(list, resourcesKey) {
  var values = {cpus: [], disk: [], mem: []};
  return _.foldl(values, function (memo, arr, r) {
    _.each(list, function (state, i) {
      var value = state[resourcesKey][r];
      var max = Math.max(1, _mesosStates[i].total_resources[r]);
      memo[r].push({
        date: state.date,
        value: Maths.round(value, 2),
        percentage: Maths.round(100 * value / max)
      });
    });
    return memo;
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
  // Ignore the first difference, since the first number of accumulated failed
  // tasks will be will consist the base case for calulating the difference
  if (_prevMesosStatusesMap != null && keys.length) {
    keys.forEach(function (key) {
      diff[key] = newMesosStatusesMap[key] - _prevMesosStatusesMap[key];
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

function processFailureRate(mesosState) {
  var failureRate = getFailureRate(mesosState);
  _failureRates.push(failureRate);
  _failureRates.shift();
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

    framework.images = _frameworkImages[framework.name];

    if (framework.images == null) {
      if (framework.name.search(/marathon/i) > -1) {
        framework.images = MARATHON_IMAGES;
      } else {
        framework.images = NA_IMAGES;
      }
    }

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

function fetchData(timeScale) {
  MesosStateActions.fetchSummary(timeScale);
  MesosStateActions.fetchMarathonHealth();
}

function startMesosSummaryPoll() {
  if (_intervals.summary == null) {
    var timeScale;
    if (!_statesProcessed) {
      timeScale = TimeScales.MINUTE;
    }
    fetchData(timeScale);
    _intervals.summary = setInterval(fetchData, Config.stateRefresh);
  }
}

function stopMesosSummaryPoll() {
  if (_intervals.summary != null) {
    clearInterval(_intervals.summary);
    _intervals.summary = null;
  }
}

function startMesosStatePoll() {
  if (_intervals.state == null) {
    MesosStateActions.fetchState();
    _intervals.state = setInterval(
      MesosStateActions.fetchState, Config.stateRefresh
    );
  }
}

function stopMesosStatePoll() {
  if (_intervals.state != null) {
    clearInterval(_intervals.state);
    _intervals.state = null;
  }
}

function addTimestampsToData(data, timeStep) {
  var length = data.length;
  var timeNow = Date.now() - timeStep;

  return _.map(data, function (datum, i) {
    var timeDelta = (-length + i) * timeStep;
    datum.date = timeNow + timeDelta;
    return datum;
  });
}

var MesosStateStore = _.extend({}, EventEmitter.prototype, {

  init: function () {
    if (_initCalledAt != null) {
      return;
    }

    // log when we started calling
    _initCalledAt = Date.now();

    startMesosSummaryPoll();
    initStates();
  },

  unmount: function () {
    stopMesosSummaryPoll();
  },

  reset: function () {
    _failureRates = [];
    _prevMesosStatusesMap = {};

    _appsProcessed = false;
    _frameworkNames = [];
    _frameworkIDs = [];
    _frameworkHealth = {};
    _lastMesosState = {};
    _loading = undefined;
    _intervals = {};
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
    return sumListResources(frameworks, "used_resources");
  },

  getTotalHostsResources: function (hosts) {
    return sumListResources(hosts, "used_resources");
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

  /**
   * @param  {Array} filter Allows us to filter by framework id
   *   All other frameworks will be put into an "other" category
   * @returns {Object} A map of frameworks running on host
   */
  getHostResourcesByFramework: function (filter) {
    var state = this.getLastMesosState();

    return _.foldl(state.frameworks, function (memo, framework) {
      _.each(framework.tasks, function (task) {
        if (memo[task.slave_id] == null) {
          memo[task.slave_id] = {};
        }

        var frameworkKey = task.framework_id;
        if (_.contains(filter, framework.id)) {
          frameworkKey = "other";
        }

        var resources = _.pick(task.resources, "cpus", "disk", "mem");
        if (memo[task.slave_id][frameworkKey] == null) {
          memo[task.slave_id][frameworkKey] = resources;
        } else {
          // Aggregates used resources from each executor
          _.each(resources, function (value, key) {
            memo[task.slave_id][frameworkKey][key] += value;
          });
        }
      });

      return memo;
    }, {});
  },

  getLastMesosState: function () {
    return _lastMesosState;
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
    return _failureRates;
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

    if (eventName === EventTypes.MESOS_STATE_CHANGE) {
      startMesosStatePoll();
    }
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);

    if (eventName === EventTypes.MESOS_STATE_CHANGE &&
      _.isEmpty(this.listeners(EventTypes.MESOS_STATE_CHANGE))) {
      stopMesosStatePoll();
    }
  },

  updateStateProcessed: function () {
    _statesProcessed = true;
    this.emitChange(EventTypes.MESOS_SUMMARY_CHANGE);
  },

  notifySummaryProcessed: function () {
    // skip if state is processed, already loading or init has not been called
    if (_statesProcessed || _loading != null || _initCalledAt == null) {
      this.emitChange(EventTypes.MESOS_SUMMARY_CHANGE);
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

  processSummary: function (data, options) {
    options = _.defaults({}, options, {silent: false});

    if (typeof data.date !== "number") {
      data.date = Date.now();
    }

    data.frameworks = normalizeFrameworks(data.frameworks, data.date);
    data.total_resources = sumResources(_.pluck(data.slaves, "resources"));
    data.used_resources = sumResources(
      _.pluck(data.frameworks, "used_resources")
    );
    data.active_slaves = getActiveSlaves(data.slaves).length;

    processFailureRate(data);

    // Add new snapshot
    _mesosStates.push(data);
    // Remove oldest snapshot when we have more than we should
    if (_mesosStates.length > Config.historyLength) {
      _mesosStates.shift();
    }

    if (options.silent === false) {
      this.notifySummaryProcessed();
    }
  },

  processBulkState: function (data) {
    // Multiply Config.stateRefresh in order to use larger time slices
    data = addTimestampsToData(data, Config.stateRefresh);
    _.each(data, function (datum) {
      MesosStateStore.processSummary(datum, {silent: true});
    });
  },

  processSummaryError: function () {
    this.emitChange(EventTypes.MESOS_SUMMARY_REQUEST_ERROR);
  },

  processMarathonApps: function (data) {
    var frameworkData = _.foldl(data.apps, function (curr, app) {
      if (app.labels.DCOS_PACKAGE_FRAMEWORK_NAME == null) {
        return curr;
      }

      var packageName = app.labels.DCOS_PACKAGE_FRAMEWORK_NAME;
      // use insensitive check
      if (packageName.length) {
        packageName = packageName.toLowerCase();
      }

      // find the framework based on package name
      var frameworkName = _.find(_frameworkNames, function (name) {
        // use insensitive check
        if (name.length) {
          name = name.toLowerCase();
        }

        // match exactly (case insensitive)
        return name === packageName;
      });

      if (frameworkName == null) {
        return curr;
      }

      curr.health[frameworkName] = getFrameworkHealth(app);
      curr.images[frameworkName] = getFrameworkImages(app);

      return curr;
    }, {health: {}, images: {}});

    // Specific health check for Marathon
    // We are setting the "marathon" key here, since we can safely assume,
    // it to be "marathon" (we control it).
    // This means that no other framework should be named "marathon".
    frameworkData.health.marathon = getFrameworkHealth({
      // Make sure health check has a result
      healthChecks: [{}],
      // Marathon is healthy if this request returned apps
      tasksHealthy: data.apps.length,
      tasksRunning: data.apps.length
    });

    _frameworkHealth = frameworkData.health;
    _frameworkImages = frameworkData.images;

    _appsProcessed = true;

    this.emitChange(EventTypes.MARATHON_APPS_CHANGE);
  },

  processMarathonAppsError: function () {
    _appsProcessed = true;

    this.emitChange(EventTypes.MARATHON_APPS_REQUEST_ERROR);
  },

  processStateSuccess: function (data) {
    _lastMesosState = data;
    this.emitChange(EventTypes.MESOS_STATE_CHANGE);
  },

  processStateError: function () {
    this.emitChange(EventTypes.MESOS_STATE_REQUEST_ERROR);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    var action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_MESOS_SUMMARY_SUCCESS:
        MesosStateStore.processSummary(action.data);
        break;
      case ActionTypes.REQUEST_MESOS_HISTORY_SUCCESS:
        MesosStateStore.processBulkState(action.data);
        break;
      case ActionTypes.REQUEST_MESOS_SUMMARY_ERROR:
      case ActionTypes.REQUEST_MESOS_HISTORY_ERROR:
        MesosStateStore.processSummaryError();
        break;
      case ActionTypes.REQUEST_MESOS_STATE_SUCCESS:
        MesosStateStore.processStateSuccess(action.data);
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
module.exports.MARATHON_IMAGES = MARATHON_IMAGES;
