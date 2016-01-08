import {Store} from "mesosphere-shared-reactjs";

import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../events/AppDispatcher";
import Config from "../config/Config";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import Item from "../structs/Item";
import LogBuffer from "../structs/LogBuffer";
import MesosLogActions from "../events/MesosLogActions";

const MAX_FILE_SIZE = 50000;

const MesosLogStore = Store.createStore({
  storeID: "mesosLog",

  mixins: [GetSetMixin],

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  startTailing: function (slaveID, path) {
    let logBuffer = new LogBuffer({maxFileSize: MAX_FILE_SIZE});
    this.set({[path]: logBuffer});
    // Request offset to initialize logBuffer
    MesosLogActions.requestOffset(slaveID, path);
  },

  stopTailing: function (path) {
    // As soon as any request responds (success or error) the tailing will stop
    this.set({[path]: undefined});
  },

  processOffset: function (slaveID, path, entry) {
    let logBuffer = this.get(path);
    if (!logBuffer) {
      // Stop tailing immediately if listener decided to call stopTailing
      return;
    }

    logBuffer.initialize(entry.offset);
    // start tailing
    MesosLogActions
      .fetchLog(slaveID, path, logBuffer.getEnd(), MAX_FILE_SIZE);

    MesosLogStore.emit(EventTypes.MESOS_INITIALIZE_LOG_CHANGE);
  },

  processOffsetError: function (slaveID, path) {
    let logBuffer = this.get(path);
    if (!logBuffer) {
      // Stop tailing immediately if listener decided to call stopTailing
      // even if the initial offset request fails
      return;
    }

    // Try to re-initialize from where we left off
    setTimeout(function () {
      MesosLogActions.requestOffset(slaveID, path);
    }, Config.tailRefresh);

    MesosLogStore.emit(EventTypes.MESOS_INITIALIZE_LOG_REQUEST_ERROR);
  },

  processLogEntry: function (slaveID, path, entry) {
    let logBuffer = this.get(path);
    if (!logBuffer) {
      // Stop tailing immediately if listener decided to call stopTailing
      return;
    }

    let data = entry.data;
    if (data.length > 0) {
      logBuffer.add(new Item(entry));
      this.emit(EventTypes.MESOS_LOG_CHANGE, path);
    }

    let end = logBuffer.getEnd();
    if (data.length === MAX_FILE_SIZE) {
      // Tail immediately if we received as much data as requested,
      // since that might mean that there is more data to show
      MesosLogActions.fetchLog(slaveID, path, end, MAX_FILE_SIZE);
    } else {
      setTimeout(function () {
        MesosLogActions.fetchLog(slaveID, path, end, MAX_FILE_SIZE);
      }, Config.tailRefresh);
    }
  },

  processLogError(slaveID, path) {
    let logBuffer = this.get(path);
    if (!logBuffer) {
      // Stop tailing immediately if listener decided to call stopTailing
      return;
    }

    // Try to re-start from where we left off
    setTimeout(function () {
      MesosLogActions
        .fetchLog(slaveID, path, logBuffer.getEnd(), MAX_FILE_SIZE);
    }, Config.tailRefresh);

    MesosLogStore.emit(EventTypes.MESOS_LOG_REQUEST_ERROR);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_MESOS_LOG_SUCCESS:
        MesosLogStore.processLogEntry(action.slaveID, action.path, action.data);
        break;
      case ActionTypes.REQUEST_MESOS_LOG_ERROR:
        MesosLogStore.processLogError(action.slaveID, action.path);
        break;
      case ActionTypes.REQUEST_MESOS_LOG_OFFSET_SUCCESS:
        MesosLogStore.processOffset(action.slaveID, action.path, action.data);
        break;
      case ActionTypes.REQUEST_MESOS_LOG_OFFSET_ERROR:
        MesosLogStore.processOffsetError(action.slaveID, action.path);
        break;
    }

    return true;
  })

});

export default MesosLogStore;
