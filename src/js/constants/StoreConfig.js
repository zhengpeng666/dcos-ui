import ACLAuthStore from '../stores/ACLAuthStore';
import ACLDirectoriesStore from '../stores/ACLDirectoriesStore';
import ACLGroupsStore from '../stores/ACLGroupsStore';
import ACLGroupStore from '../stores/ACLGroupStore';
import ACLStore from '../stores/ACLStore';
import ACLUsersStore from '../stores/ACLUsersStore';
import ACLUserStore from '../stores/ACLUserStore';
import CosmosPackagesStore from '../stores/CosmosPackagesStore';
import EventTypes from './EventTypes';
import MarathonStore from '../stores/MarathonStore';
import MesosLogStore from '../stores/MesosLogStore';
import MesosStateStore from '../stores/MesosStateStore';
import MesosSummaryStore from '../stores/MesosSummaryStore';
import MetadataStore from '../stores/MetadataStore';
import TaskDirectoryStore from '../stores/TaskDirectoryStore';


const ListenersDescription = {

  acl: {
    store: ACLStore,
    events: {
      createSuccess: EventTypes.ACL_CREATE_SUCCESS,
      createError: EventTypes.ACL_CREATE_ERROR,
      fetchResourceSuccess: EventTypes.ACL_RESOURCE_ACLS_CHANGE,
      fetchResourceError: EventTypes.ACL_RESOURCE_ACLS_ERROR,
      userGrantSuccess: EventTypes.ACL_USER_GRANT_ACTION_CHANGE,
      userGrantError: EventTypes.ACL_USER_GRANT_ACTION_ERROR,
      userRevokeSuccess: EventTypes.ACL_USER_REVOKE_ACTION_CHANGE,
      userRevokeError: EventTypes.ACL_USER_REVOKE_ACTION_ERROR,
      groupGrantSuccess: EventTypes.ACL_GROUP_GRANT_ACTION_CHANGE,
      groupGrantError: EventTypes.ACL_GROUP_GRANT_ACTION_ERROR,
      groupRevokeSuccess: EventTypes.ACL_GROUP_REVOKE_ACTION_CHANGE,
      groupRevokeError: EventTypes.ACL_GROUP_REVOKE_ACTION_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  aclDirectories: {
    store: ACLDirectoriesStore,
    events: {
      fetchSuccess: EventTypes.ACL_DIRECTORIES_CHANGED,
      fetchError: EventTypes.ACL_DIRECTORIES_ERROR,
      addSuccess: EventTypes.ACL_DIRECTORY_ADD_SUCCESS,
      addError: EventTypes.ACL_DIRECTORY_ADD_ERROR,
      deleteSuccess: EventTypes.ACL_DIRECTORY_DELETE_SUCCESS,
      deleteError: EventTypes.ACL_DIRECTORY_DELETE_ERROR,
      testSuccess: EventTypes.ACL_DIRECTORY_TEST_SUCCESS,
      testError: EventTypes.ACL_DIRECTORY_TEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  auth: {
    store: ACLAuthStore,
    events: {
      success: EventTypes.ACL_AUTH_USER_LOGIN_CHANGED,
      error: EventTypes.ACL_AUTH_USER_LOGIN_ERROR,
      logoutSuccess: EventTypes.ACL_AUTH_USER_LOGOUT_SUCCESS,
      logoutError: EventTypes.ACL_AUTH_USER_LOGOUT_ERROR,
      roleChange: EventTypes.ACL_AUTH_USER_ROLE_CHANGED
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  cosmosPackages: {
    store: CosmosPackagesStore,
    events: {
      descriptionSuccess: EventTypes.COSMOS_DESCRIBE_CHANGE,
      descriptionError: EventTypes.COSMOS_DESCRIBE_ERROR,
      installedSuccess: EventTypes.COSMOS_LIST_CHANGE,
      installedError: EventTypes.COSMOS_LIST_ERROR,
      availableSuccess: EventTypes.COSMOS_SEARCH_CHANGE,
      availableError: EventTypes.COSMOS_SEARCH_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  summary: {
    // Which store to use
    store: MesosSummaryStore,

    // What event to listen to
    events: {
      success: EventTypes.MESOS_SUMMARY_CHANGE,
      error: EventTypes.MESOS_SUMMARY_REQUEST_ERROR
    },

    // When to remove listener
    unmountWhen: function (store, event) {
      if (event === 'success') {
        return store.get('statesProcessed');
      }
    },

    // Set to true to keep listening until unmount
    listenAlways: true
  },

  state: {
    store: MesosStateStore,
    events: {
      success: EventTypes.MESOS_STATE_CHANGE,
      error: EventTypes.MESOS_STATE_REQUEST_ERROR
    },
    unmountWhen: function (store, event) {
      if (event === 'success') {
        return Object.keys(store.get('lastMesosState')).length;
      }
    },
    listenAlways: true
  },

  marathon: {
    store: MarathonStore,
    events: {
      success: EventTypes.MARATHON_APPS_CHANGE,
      error: EventTypes.MARATHON_APPS_ERROR
    },
    unmountWhen: function (store, event) {
      if (event === 'success') {
        return store.hasProcessedApps();
      }
    },
    listenAlways: true
  },

  metadata: {
    store: MetadataStore,
    events: {
      success: EventTypes.METADATA_CHANGE,
      dcosSuccess: EventTypes.DCOS_METADATA_CHANGE
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  mesosLog: {
    store: MesosLogStore,
    events: {
      success: EventTypes.MESOS_LOG_CHANGE,
      error: EventTypes.MESOS_LOG_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true,
    suppressUpdate: true
  },

  taskDirectory: {
    store: TaskDirectoryStore,
    events: {
      success: EventTypes.TASK_DIRECTORY_CHANGE,
      error: EventTypes.TASK_DIRECTORY_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  groups: {
    store: ACLGroupsStore,
    events: {
      success: EventTypes.ACL_GROUPS_CHANGE,
      error: EventTypes.ACL_GROUPS_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  group: {
    store: ACLGroupStore,
    events: {
      success: EventTypes.ACL_GROUP_DETAILS_GROUP_CHANGE,
      error: EventTypes.ACL_GROUP_DETAILS_GROUP_ERROR,
      addUserSuccess: EventTypes.ACL_GROUP_USERS_CHANGED,
      addUserError: EventTypes.ACL_GROUP_ADD_USER_ERROR,
      createSuccess: EventTypes.ACL_GROUP_CREATE_SUCCESS,
      createError: EventTypes.ACL_GROUP_CREATE_ERROR,
      updateError: EventTypes.ACL_GROUP_UPDATE_ERROR,
      updateSuccess: EventTypes.ACL_GROUP_UPDATE_SUCCESS,
      permissionsSuccess: EventTypes.ACL_GROUP_DETAILS_PERMISSIONS_CHANGE,
      permissionsError: EventTypes.ACL_GROUP_DETAILS_PERMISSIONS_ERROR,
      usersSuccess: EventTypes.ACL_GROUP_DETAILS_USERS_CHANGE,
      usersError: EventTypes.ACL_GROUP_DETAILS_USERS_ERROR,
      fetchedDetailsSuccess: EventTypes.ACL_GROUP_DETAILS_FETCHED_SUCCESS,
      fetchedDetailsError: EventTypes.ACL_GROUP_DETAILS_FETCHED_ERROR,
      deleteUserSuccess: EventTypes.ACL_GROUP_REMOVE_USER_SUCCESS,
      deleteUserError: EventTypes.ACL_GROUP_REMOVE_USER_ERROR,
      deleteSuccess: EventTypes.ACL_GROUP_DELETE_SUCCESS,
      deleteError: EventTypes.ACL_GROUP_DELETE_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  users: {
    store: ACLUsersStore,
    events: {
      success: EventTypes.ACL_USERS_CHANGE,
      error: EventTypes.ACL_USERS_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  user: {
    store: ACLUserStore,
    events: {
      success: EventTypes.ACL_USER_DETAILS_USER_CHANGE,
      error: EventTypes.ACL_USER_DETAILS_USER_ERROR,
      permissionsSuccess: EventTypes.ACL_USER_DETAILS_PERMISSIONS_CHANGE,
      permissionsError: EventTypes.ACL_USER_DETAILS_PERMISSIONS_ERROR,
      groupsSuccess: EventTypes.ACL_USER_DETAILS_GROUPS_CHANGE,
      groupsError: EventTypes.ACL_USER_DETAILS_GROUPS_ERROR,
      fetchedDetailsSuccess: EventTypes.ACL_USER_DETAILS_FETCHED_SUCCESS,
      fetchedDetailsError: EventTypes.ACL_USER_DETAILS_FETCHED_ERROR,
      createSuccess: EventTypes.ACL_USER_CREATE_SUCCESS,
      createError: EventTypes.ACL_USER_CREATE_ERROR,
      updateSuccess: EventTypes.ACL_USER_UPDATE_SUCCESS,
      updateError: EventTypes.ACL_USER_UPDATE_ERROR,
      deleteSuccess: EventTypes.ACL_USER_DELETE_SUCCESS,
      deleteError: EventTypes.ACL_USER_DELETE_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  }
};

module.exports = ListenersDescription;
