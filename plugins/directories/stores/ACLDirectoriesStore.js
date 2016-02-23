import {Store} from 'mesosphere-shared-reactjs';

import {
  REQUEST_ACL_DIRECTORIES_SUCCESS,
  REQUEST_ACL_DIRECTORIES_ERROR,
  REQUEST_ACL_DIRECTORY_ADD_SUCCESS,
  REQUEST_ACL_DIRECTORY_ADD_ERROR,
  REQUEST_ACL_DIRECTORY_DELETE_SUCCESS,
  REQUEST_ACL_DIRECTORY_DELETE_ERROR,
  REQUEST_ACL_DIRECTORY_TEST_SUCCESS,
  REQUEST_ACL_DIRECTORY_TEST_ERROR,
} from '../constants/ActionTypes';

import {
  ACL_DIRECTORIES_CHANGED,
  ACL_DIRECTORIES_ERROR,
  ACL_DIRECTORY_ADD_SUCCESS,
  ACL_DIRECTORY_ADD_ERROR,
  ACL_DIRECTORY_DELETE_SUCCESS,
  ACL_DIRECTORY_DELETE_ERROR,
  ACL_DIRECTORY_TEST_SUCCESS,
  ACL_DIRECTORY_TEST_ERROR
} from '../constants/EventTypes';

import {SERVER_ACTION} from '../../../src/js/constants/ActionTypes';

import ACLDirectoriesActions from '../actions/ACLDirectoriesActions';
import AppDispatcher from '../../../src/js/events/AppDispatcher';
import GetSetMixin from '../../../src/js/mixins/GetSetMixin';
import List from '../../../src/js/structs/List';
// import PluginBridge from '../../../src/js/pluginBridge/PluginBridge';

var ACLDirectoriesStore = Store.createStore({
  storeID: 'aclDirectories',

  mixins: [GetSetMixin],

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  addDirectory: ACLDirectoriesActions.addDirectory,

  deleteDirectory: ACLDirectoriesActions.deleteDirectory,

  testDirectoryConnection: ACLDirectoriesActions.testDirectoryConnection,

  fetchDirectories: ACLDirectoriesActions.fetchDirectories,

  processDirectoriesSuccess(directories) {
    this.set({
      directories: new List({items: directories})
    });
    this.emit(ACL_DIRECTORIES_CHANGED);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== SERVER_ACTION) {
      return false;
    }

    let {data, type} = payload.action;

    switch (type) {
      // Get a list of external directories
      case REQUEST_ACL_DIRECTORIES_SUCCESS:
        ACLDirectoriesStore.processDirectoriesSuccess(data);
        break;
      case REQUEST_ACL_DIRECTORIES_ERROR:
        ACLDirectoriesStore.emit(ACL_DIRECTORIES_ERROR, data);
        break;
      case REQUEST_ACL_DIRECTORY_ADD_SUCCESS:
        ACLDirectoriesStore.emit(ACL_DIRECTORY_ADD_SUCCESS);
        break;
      case REQUEST_ACL_DIRECTORY_ADD_ERROR:
        ACLDirectoriesStore.emit(ACL_DIRECTORY_ADD_ERROR, data);
        break;
      case REQUEST_ACL_DIRECTORY_DELETE_SUCCESS:
        ACLDirectoriesStore.set({directories: null});
        ACLDirectoriesStore.emit(ACL_DIRECTORY_DELETE_SUCCESS);
        break;
      case REQUEST_ACL_DIRECTORY_DELETE_ERROR:
        ACLDirectoriesStore.emit(ACL_DIRECTORY_DELETE_ERROR, data);
        break;
      case REQUEST_ACL_DIRECTORY_TEST_SUCCESS:
        ACLDirectoriesStore.emit(ACL_DIRECTORY_TEST_SUCCESS, data);
        break;
      case REQUEST_ACL_DIRECTORY_TEST_ERROR:
        ACLDirectoriesStore.emit(ACL_DIRECTORY_TEST_ERROR, data);
        break;
    }

    return true;
  })
});

module.exports = ACLDirectoriesStore;
