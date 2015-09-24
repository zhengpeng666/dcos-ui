var _ = require("underscore");

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var Config = require("../config/Config");
var EventTypes = require("../constants/EventTypes");
var GetSetMixin = require("../mixins/GetSetMixin");
var MesosStateActions = require("../events/MesosStateActions");
var Store = require("../utils/Store");
var MesosStateUtil = require("../utils/MesosStateUtil");

var requestInterval = null;

function startPolling() {
  if (requestInterval == null) {
    MesosStateActions.fetchState();
    requestInterval = setInterval(
      MesosStateActions.fetchState, Config.getRefreshRate()
    );
  }
}

function stopPolling() {
  if (requestInterval != null) {
    clearInterval(requestInterval);
    requestInterval = null;
  }
}

var MesosStateStore = Store.createStore({

  mixins: [GetSetMixin],

  getSet_data: {
    lastMesosState: {}
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
    startPolling();
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);

    if (_.isEmpty(this.listeners(EventTypes.MESOS_STATE_CHANGE))) {
      stopPolling();
    }
  },

  getHostResourcesByFramework: function (filter) {
    return MesosStateUtil.getHostResourcesByFramework(
      MesosStateStore.get("lastMesosState"), filter
    );
  },

  getServiceFromName: function (name) {
    let services = this.get("lastMesosState").frameworks;
    return _.findWhere(services, {name});
  },

  getNodeFromID: function (id) {
    let nodes = this.get("lastMesosState").slaves;
    return _.findWhere(nodes, {id});
  },

  getTasksFromNodeID: function (nodeID) {
    let services = this.get("lastMesosState").frameworks;
    let memberTasks = {};

    services.forEach(function (service) {
      service.tasks.forEach(function (task) {
        if (task.slave_id === nodeID) {
          memberTasks[task.id] = task;
        }
      });
    });

    return _.values(memberTasks);
  },

  getTaskFromTaskID: function (taskID) {
    let services = this.get("lastMesosState").frameworks;
    let foundTask = null;

    _.some(services, function (service) {
      return _.some(service.tasks, function (task) {
        var equalTask = task.id === taskID;

        if (equalTask) {
          foundTask = task;
        }

        return equalTask;
      });
    });

    return foundTask;
  },

  getTasksFromServiceName: function (serviceName) {
    let frameworks = this.get("lastMesosState").frameworks;
    let framework = _.findWhere(frameworks, {name: serviceName});

    if (framework) {
      let activeTasks = framework.tasks || [];
      let completedTasks = framework.completed_tasks || [];

      return activeTasks.concat(completedTasks);
    }

    return [];
  },

  processStateSuccess: function (lastMesosState) {
    this.set({lastMesosState});
    this.emit(EventTypes.MESOS_STATE_CHANGE);
  },

  processStateError: function () {
    this.emit(EventTypes.MESOS_STATE_REQUEST_ERROR);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    var action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_MESOS_STATE_SUCCESS:
        MesosStateStore.processStateSuccess(action.data);
        break;
      case ActionTypes.REQUEST_MESOS_STATE_ERROR:
        MesosStateStore.processStateError();
        break;
    }

    return true;
  })

});

module.exports = MesosStateStore;
