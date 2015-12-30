import Config from "../config/Config";
import MesosLogActions from "../events/MesosLogActions";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../events/AppDispatcher";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import Item from "../structs/Item";
import LogFile from "../structs/LogFile";
import Store from "../utils/Store";

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
    let logFile = new LogFile({maxFileSize: MAX_FILE_SIZE});
    let state = {};
    state[path] = logFile;
    this.set(state);
    MesosLogActions.fetchLog(slaveID, path, logFile.getEnd(), MAX_FILE_SIZE);
  },

  stopTailing: function (path) {
    let logFile = {};
    logFile[path] = undefined;
    this.set(logFile);
  },

  processLogEntry: function (slaveID, path, entry) {
    let logFile = this.get(path);
    if (!logFile) {
      return;
    }

    if (!logFile.getInitialized()) {
      logFile.initialize(entry);
      MesosLogActions.fetchLog(slaveID, path, logFile.getEnd(), MAX_FILE_SIZE);
      return;
    }

    let data = entry.data;
    if (data.length > 0) {
      logFile.add(new Item(entry));
      this.emit(EventTypes.MESOS_LOG_CHANGE, path);
    }

    let end = logFile.getEnd();
    if (data.length === MAX_FILE_SIZE) {
      // Tail immediately if we received as much data as requested,
      // since that might mean that there is more data to show
      setTimeout(function () {
        MesosLogActions.fetchLog(slaveID, path, end, MAX_FILE_SIZE);
      }, 0);
    } else {
      setTimeout(function () {
        MesosLogActions.fetchLog(slaveID, path, end, MAX_FILE_SIZE);
      }, Config.tailRefresh);
    }
  },

  processLogError(slaveID, path) {
    let logFile = this.get(path);
    logFile.unInitialize();

    // Try to re-initialize from where we left off
    setTimeout(function () {
      MesosLogActions.fetchLog(slaveID, path, logFile.getEnd(), MAX_FILE_SIZE);
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
    }

    return true;
  })

});

export default MesosLogStore;
