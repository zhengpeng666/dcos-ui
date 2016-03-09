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

import ACLDirectoriesActions from '../actions/ACLDirectoriesActions';

let SDK = require('../../../SDK').getSDK();

let List = SDK.get('List');

let ACLDirectoriesStore = SDK.createStore({
  storeID: 'aclDirectories',

  mixinEvents: {
    events: {
      fetchSuccess: ACL_DIRECTORIES_CHANGED,
      fetchError: ACL_DIRECTORIES_ERROR,
      addSuccess: ACL_DIRECTORY_ADD_SUCCESS,
      addError: ACL_DIRECTORY_ADD_ERROR,
      deleteSuccess: ACL_DIRECTORY_DELETE_SUCCESS,
      deleteError: ACL_DIRECTORY_DELETE_ERROR,
      testSuccess: ACL_DIRECTORY_TEST_SUCCESS,
      testError: ACL_DIRECTORY_TEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  addDirectory: ACLDirectoriesActions.addDirectory,

  deleteDirectory: ACLDirectoriesActions.deleteDirectory,

  testDirectoryConnection: ACLDirectoriesActions.testDirectoryConnection,

  fetchDirectories: ACLDirectoriesActions.fetchDirectories,

  processDirectoriesSuccess(directories) {
    SDK.dispatch({
      type: ACL_DIRECTORIES_CHANGED,
      directories
    });
    this.emit(ACL_DIRECTORIES_CHANGED);
  },

  getDirectories() {
    return new List({items: SDK.Store.getOwnState().directories.list});
  }
});

SDK.onDispatch(function (action) {
  let {data, type} = action;

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
      ACLDirectoriesStore.processDirectoriesSuccess([]);
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
});

module.exports = ACLDirectoriesStore;

