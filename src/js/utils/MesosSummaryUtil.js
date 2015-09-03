var _ = require("underscore");

var Config = require("../config/Config");
var Maths = require("../utils/Maths");
let MarathonStore = require("../stores/MarathonStore");

const MesosSummaryUtil = {

  getFrameworksWithHostsCount: function (frameworks) {
    return _.map(frameworks, function (framework) {
      if (framework.slave_ids == null) {
        framework.slave_ids = [];
      }

      // TODO: IMPORTANT Stop mutating server data!
      framework.slaves_count = framework.slave_ids.length;
      return framework;
    });
  },

  sumResources: function (resourceList) {
    return _.foldl(resourceList, function (memo, resource) {
      if (resource == null) {
        return memo;
      }

      _.each(memo, function (value, key) {
        memo[key] = value + resource[key];
      });

      return memo;
    }, {cpus: 0, mem: 0, disk: 0});
  },

  filterServicesByHealth: function (services, healthFilter) {
    return _.filter(services, function (service) {
      let appHealth = MarathonStore.getServiceHealth(service.name);
      return appHealth.value === healthFilter;
    });
  },

  /**
   * This function will create a single object of states with the sum of
   * resources in actual value and percentage of each step in the given list.
   *
   * @param {Array} mesosStates A list of Mesos States
   * @param {Array} list of time steps with a resources object,
   * each holding a resource value of that time step (elements by state)
   * @param {String} resourcesKey to look up the resources object
   * @return {Object} Each resource in the object holds a list of
   *   time steps with summed resources of the provided list
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
  sumListResources: function (mesosStates, list, resourcesKey) {
    return _.foldl(list, function (memo, element) {
      _.each(memo, function (value, key) {
        var values = element[resourcesKey][key];
        _.each(values, function (val, i) {
          var max = Math.max(1, mesosStates[i].total_resources[key]);
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
  },

  /**
   * This function will transpose a list of states into an object of resources
   * with an equal list of steps for each resource
   *
   * @param {Array} mesosStates A list of Mesos States
   * @param {Array} list of time steps with a resources object,
   * each holding a resource value of that time step (elements by state)
   * @param {String} resourcesKey to look up the resources object
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
  getStatesByResource: function (mesosStates, list, resourcesKey) {
    var values = {cpus: [], disk: [], mem: []};
    return _.foldl(values, function (memo, array, type) {
      _.each(list, function (state, i) {
        var value = state[resourcesKey][type];
        var max = Math.max(1, mesosStates[i].total_resources[type]);
        memo[type].push({
          date: state.date,
          value: Maths.round(value, 2),
          percentage: Maths.round(100 * value / max)
        });
      });
      return memo;
    }, values);
  },

  getFrameworksTaskTotals: function (frameworks) {
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
  },

  // Caluculate a failure rate
  getFailureRate: function (mesosState, prevMesosState) {
    var prevMesosStatusesMap = this.getFrameworksTaskTotals(
      prevMesosState.frameworks
    );
    var newMesosStatusesMap = this.getFrameworksTaskTotals(
      mesosState.frameworks
    );
    var failed = 0;
    var successful = 0;
    var diff = {};

    // Only compute diff if we have previous data
    var keys = Object.keys(newMesosStatusesMap);
    // Ignore the first difference, since the first number of accumulated failed
    // tasks will be will consist the base case for calulating the difference
    if (prevMesosStatusesMap != null && keys.length) {
      keys.forEach(function (key) {
        diff[key] = newMesosStatusesMap[key] - prevMesosStatusesMap[key];
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

    return {
      date: mesosState.date,
      rate: (failed / (failed + successful)) * 100 | 0
    };
  },

  /**
   * This function will create a list of frameworks with an object of used
   * resources. Each resource holds a list of steps equal to the mesos states
   *
   * @param {Array} mesosStates A list of Mesos States
   * @return {Array} List of frameworks with color and name details, etc.
   * Each framework has its on set of resources. See getStatesByResource for
   * more information.
   * [{
   *   colorIndex: 0,
   *   name: "Marathon",
   *   used_resorces: {
   *     cpus: [...],
   *     disk: [...],
   *     mem: [...],
   *   }
   * }, ...]
   */
  getStatesByFramework: function (mesosStates) {
    return _.chain(mesosStates)
      .pluck("frameworks")
      .flatten()
      .groupBy(function (framework) {
        return framework.id;
      })
      .map(function (framework) {
        var lastFramework = _.clone(_.last(framework));

        return _.extend(lastFramework, {
          used_resources: this.getStatesByResource(
            mesosStates, framework, "used_resources"
          )
        });
      }, this)
      .value();
  },

  /**
   * Given mesos states and a slave, this function will create an object of used
   * resources. Each resource holds a list of steps equal to the mesos states
   *
   * @param {Array} mesosStates of time steps with a total_resources object,
   * each holding a resource value of that time step (elements by state)
   * @param {Object} slave object to calculate resources from
   * @return {Object} Calculated resources for the given slave
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
  getHostResourcesBySlave: function (mesosStates, slave) {
    return _.foldl(mesosStates, function (memo, state) {
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
  },

  /**
   * This function will create a list of hosts with an object of used
   * resources. Each resource holds a list of steps equal to the mesos states
   *
   * @param {Array} mesosStates A list of Mesos States
   * @return {Array} List of hosts with resources as time steps
   * [{
   *  ...
   *  id: "",
   *  hostname: "",
   *  tasks: {},
   *  frameworks: {},
   *  used_resources: {cpus: [], mem: [], disk: []}
   * }]
   */
  getStateByHosts: function (mesosStates) {
    return _.map(_.last(mesosStates).slaves, function (_slave) {
      var slave = _.clone(_slave);
      slave.used_resources = this.getHostResourcesBySlave(mesosStates, _slave);
      return slave;
    }, this);
  },

  addFrameworkToPreviousStates: function (mesosStates, _framework, colorIndex) {
    _.each(mesosStates, function (state) {
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
  },

  filterHostsByService: function (hosts, frameworkId) {
    return _.filter(hosts, function (host) {
      return _.contains(host.framework_ids, frameworkId);
    });
  },

  getInitialStates: function () {
    var currentDate = Date.now();
    // reverse date range!!!
    return _.map(_.range(-Config.historyLength, 0), function (i) {
      return {
        date: currentDate + (i * Config.getRefreshRate()),
        frameworks: [],
        slaves: [],
        used_resources: {cpus: 0, mem: 0, disk: 0},
        total_resources: {cpus: 0, mem: 0, disk: 0},
        active_slaves: 0
      };
    });
  },

  getInitialTaskFailureRates: function () {
    var currentDate = Date.now();
    return _.map(_.range(-Config.historyLength, 0), function (i) {
      return {
        date: currentDate + (i * Config.getRefreshRate()),
        rate: 0
      };
    });
  },

  addTimestampsToData: function (data, timeStep) {
    var length = data.length;
    var timeNow = Date.now() - timeStep;

    return _.map(data, function (datum, i) {
      var timeDelta = (-length + i) * timeStep;
      datum.date = timeNow + timeDelta;
      return datum;
    });
  }

};

module.exports = MesosSummaryUtil;
