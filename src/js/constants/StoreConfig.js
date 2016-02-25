// Auth
import ACLAuthStore from '../../../plugins/auth/stores/ACLAuthStore';
import {
  ACL_AUTH_USER_LOGIN_CHANGED,
  ACL_AUTH_USER_LOGIN_ERROR,
  ACL_AUTH_USER_LOGOUT_SUCCESS,
  ACL_AUTH_USER_LOGOUT_ERROR,
  ACL_AUTH_USER_ROLE_CHANGED
} from '../../../plugins/auth/constants/EventTypes';

// Directories
import ACLDirectoriesStore from '../../../plugins/directories/stores/ACLDirectoriesStore';
import {
  ACL_DIRECTORIES_CHANGED,
  ACL_DIRECTORIES_ERROR,
  ACL_DIRECTORY_ADD_SUCCESS,
  ACL_DIRECTORY_ADD_ERROR,
  ACL_DIRECTORY_DELETE_SUCCESS,
  ACL_DIRECTORY_DELETE_ERROR,
  ACL_DIRECTORY_TEST_SUCCESS,
  ACL_DIRECTORY_TEST_ERROR
} from '../../../plugins/directories/constants/EventTypes';

// Groups
import ACLGroupsStore from '../../../plugins/groups/stores/ACLGroupsStore';
import ACLGroupStore from '../../../plugins/groups/stores/ACLGroupStore';
import {
  ACL_GROUPS_CHANGE,
  ACL_GROUPS_REQUEST_ERROR,
  ACL_GROUP_DETAILS_GROUP_CHANGE,
  ACL_GROUP_DETAILS_GROUP_ERROR,
  ACL_GROUP_USERS_CHANGED,
  ACL_GROUP_ADD_USER_ERROR,
  ACL_GROUP_CREATE_SUCCESS,
  ACL_GROUP_CREATE_ERROR,
  ACL_GROUP_UPDATE_ERROR,
  ACL_GROUP_UPDATE_SUCCESS,
  ACL_GROUP_DETAILS_PERMISSIONS_CHANGE,
  ACL_GROUP_DETAILS_PERMISSIONS_ERROR,
  ACL_GROUP_DETAILS_USERS_CHANGE,
  ACL_GROUP_DETAILS_USERS_ERROR,
  ACL_GROUP_DETAILS_FETCHED_SUCCESS,
  ACL_GROUP_DETAILS_FETCHED_ERROR,
  ACL_GROUP_REMOVE_USER_SUCCESS,
  ACL_GROUP_REMOVE_USER_ERROR,
  ACL_GROUP_DELETE_SUCCESS,
  ACL_GROUP_DELETE_ERROR
} from '../../../plugins/groups/constants/EventTypes';

// ACL
import ACLStore from '../../../plugins/acl/stores/ACLStore';
import {
  ACL_CREATE_SUCCESS,
  ACL_CREATE_ERROR,
  ACL_RESOURCE_ACLS_CHANGE,
  ACL_RESOURCE_ACLS_ERROR,
  ACL_USER_GRANT_ACTION_CHANGE,
  ACL_USER_GRANT_ACTION_ERROR,
  ACL_USER_REVOKE_ACTION_CHANGE,
  ACL_USER_REVOKE_ACTION_ERROR,
  ACL_GROUP_GRANT_ACTION_CHANGE,
  ACL_GROUP_GRANT_ACTION_ERROR,
  ACL_GROUP_REVOKE_ACTION_CHANGE,
  ACL_GROUP_REVOKE_ACTION_ERROR
} from '../../../plugins/acl/constants/EventTypes';

// Users
import ACLUsersStore from '../../../plugins/users/stores/ACLUsersStore';
import ACLUserStore from '../../../plugins/users/stores/ACLUserStore';
import {
  ACL_USERS_CHANGE,
  ACL_USERS_REQUEST_ERROR,
  ACL_USER_DETAILS_USER_CHANGE,
  ACL_USER_DETAILS_USER_ERROR,
  ACL_USER_DETAILS_PERMISSIONS_CHANGE,
  ACL_USER_DETAILS_PERMISSIONS_ERROR,
  ACL_USER_DETAILS_GROUPS_CHANGE,
  ACL_USER_DETAILS_GROUPS_ERROR,
  ACL_USER_DETAILS_FETCHED_SUCCESS,
  ACL_USER_DETAILS_FETCHED_ERROR,
  ACL_USER_CREATE_SUCCESS,
  ACL_USER_CREATE_ERROR,
  ACL_USER_UPDATE_SUCCESS,
  ACL_USER_UPDATE_ERROR,
  ACL_USER_DELETE_SUCCESS,
  ACL_USER_DELETE_ERROR
} from '../../../plugins/users/constants/EventTypes';

import CosmosPackagesStore from '../stores/CosmosPackagesStore';
import {
  COSMOS_DESCRIBE_CHANGE,
  COSMOS_DESCRIBE_ERROR,
  COSMOS_LIST_CHANGE,
  COSMOS_LIST_ERROR,
  COSMOS_SEARCH_CHANGE,
  COSMOS_SEARCH_ERROR,

  HEALTH_UNITS_CHANGE,
  HEALTH_UNITS_ERROR,
  HEALTH_UNIT_SUCCESS,
  HEALTH_UNIT_ERROR,
  HEALTH_UNIT_NODES_SUCCESS,
  HEALTH_UNIT_NODES_ERROR,
  HEALTH_UNIT_NODE_SUCCESS,
  HEALTH_UNIT_NODE_ERROR,

  MESOS_SUMMARY_CHANGE,
  MESOS_SUMMARY_REQUEST_ERROR,
  MESOS_STATE_CHANGE,
  MESOS_STATE_REQUEST_ERROR,

  MARATHON_APPS_CHANGE,
  MARATHON_APPS_ERROR,

  NETWORKING_BACKEND_CONNECTIONS_CHANGE,
  NETWORKING_BACKEND_CONNECTIONS_REQUEST_ERROR,
  NETWORKING_NODE_MEMBERSHIP_CHANGE,
  NETWORKING_NODE_MEMBERSHIP_REQUEST_ERROR,
  NETWORKING_VIPS_CHANGE,
  NETWORKING_VIPS_REQUEST_ERROR,
  NETWORKING_VIP_DETAIL_CHANGE,
  NETWORKING_VIP_DETAIL_REQUEST_ERROR,
  NETWORKING_VIP_SUMMARIES_CHANGE,
  NETWORKING_VIP_SUMMARIES_ERROR,

  METADATA_CHANGE,

  DCOS_METADATA_CHANGE,

  MESOS_LOG_CHANGE,
  MESOS_LOG_REQUEST_ERROR,

  TASK_DIRECTORY_CHANGE,
  TASK_DIRECTORY_ERROR
} from './EventTypes';
import MarathonStore from '../stores/MarathonStore';
import MesosLogStore from '../stores/MesosLogStore';
import MesosStateStore from '../stores/MesosStateStore';
import MesosSummaryStore from '../stores/MesosSummaryStore';
import MetadataStore from '../stores/MetadataStore';
import NetworkingBackendConnectionsStore from '../stores/NetworkingBackendConnectionsStore';
import NetworkingNodeMembershipsStore from '../stores/NetworkingNodeMembershipsStore';
import NetworkingVIPsStore from '../stores/NetworkingVIPsStore';
import NetworkingVIPSummariesStore from '../stores/NetworkingVIPSummariesStore';
import TaskDirectoryStore from '../stores/TaskDirectoryStore';
import UnitHealthStore from '../stores/UnitHealthStore';

const ListenersDescription = {

  acl: {
    store: ACLStore,
    events: {
      createSuccess: ACL_CREATE_SUCCESS,
      createError: ACL_CREATE_ERROR,
      fetchResourceSuccess: ACL_RESOURCE_ACLS_CHANGE,
      fetchResourceError: ACL_RESOURCE_ACLS_ERROR,
      userGrantSuccess: ACL_USER_GRANT_ACTION_CHANGE,
      userGrantError: ACL_USER_GRANT_ACTION_ERROR,
      userRevokeSuccess: ACL_USER_REVOKE_ACTION_CHANGE,
      userRevokeError: ACL_USER_REVOKE_ACTION_ERROR,
      groupGrantSuccess: ACL_GROUP_GRANT_ACTION_CHANGE,
      groupGrantError: ACL_GROUP_GRANT_ACTION_ERROR,
      groupRevokeSuccess: ACL_GROUP_REVOKE_ACTION_CHANGE,
      groupRevokeError: ACL_GROUP_REVOKE_ACTION_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  aclDirectories: {
    store: ACLDirectoriesStore,
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

  auth: {
    store: ACLAuthStore,
    events: {
      success: ACL_AUTH_USER_LOGIN_CHANGED,
      error: ACL_AUTH_USER_LOGIN_ERROR,
      logoutSuccess: ACL_AUTH_USER_LOGOUT_SUCCESS,
      logoutError: ACL_AUTH_USER_LOGOUT_ERROR,
      roleChange: ACL_AUTH_USER_ROLE_CHANGED
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  unitHealth: {
    store: UnitHealthStore,
    events: {
      success: HEALTH_UNITS_CHANGE,
      error: HEALTH_UNITS_ERROR,
      unitSuccess: HEALTH_UNIT_SUCCESS,
      unitErorr: HEALTH_UNIT_ERROR,
      nodesSuccess: HEALTH_UNIT_NODES_SUCCESS,
      nodesError: HEALTH_UNIT_NODES_ERROR,
      nodeSuccess: HEALTH_UNIT_NODE_SUCCESS,
      nodeError: HEALTH_UNIT_NODE_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  cosmosPackages: {
    store: CosmosPackagesStore,
    events: {
      descriptionSuccess: COSMOS_DESCRIBE_CHANGE,
      descriptionError: COSMOS_DESCRIBE_ERROR,
      installedSuccess: COSMOS_LIST_CHANGE,
      installedError: COSMOS_LIST_ERROR,
      availableSuccess: COSMOS_SEARCH_CHANGE,
      availableError: COSMOS_SEARCH_ERROR
    },
    unmountWhen: function (store, event) {
      return event === 'availableSuccess';
    },
    listenAlways: false
  },

  networkingBackendConnections: {
    store: NetworkingBackendConnectionsStore,
    events: {
      success: NETWORKING_BACKEND_CONNECTIONS_CHANGE,
      error: NETWORKING_BACKEND_CONNECTIONS_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  networkingNodeMemberships: {
    store: NetworkingNodeMembershipsStore,
    events: {
      success: NETWORKING_NODE_MEMBERSHIP_CHANGE,
      error: NETWORKING_NODE_MEMBERSHIP_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  networkingVIPs: {
    store: NetworkingVIPsStore,
    events: {
      success: NETWORKING_VIPS_CHANGE,
      error: NETWORKING_VIPS_REQUEST_ERROR,
      detailSuccess: NETWORKING_VIP_DETAIL_CHANGE,
      detailError: NETWORKING_VIP_DETAIL_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  networkingVIPSummaries: {
    store: NetworkingVIPSummariesStore,
    events: {
      success: NETWORKING_VIP_SUMMARIES_CHANGE,
      error: NETWORKING_VIP_SUMMARIES_ERROR
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
      success: MESOS_SUMMARY_CHANGE,
      error: MESOS_SUMMARY_REQUEST_ERROR
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
      success: MESOS_STATE_CHANGE,
      error: MESOS_STATE_REQUEST_ERROR
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
      success: MARATHON_APPS_CHANGE,
      error: MARATHON_APPS_ERROR
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
      success: METADATA_CHANGE,
      dcosSuccess: DCOS_METADATA_CHANGE
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  mesosLog: {
    store: MesosLogStore,
    events: {
      success: MESOS_LOG_CHANGE,
      error: MESOS_LOG_REQUEST_ERROR
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
      success: TASK_DIRECTORY_CHANGE,
      error: TASK_DIRECTORY_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  groups: {
    store: ACLGroupsStore,
    events: {
      success: ACL_GROUPS_CHANGE,
      error: ACL_GROUPS_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  group: {
    store: ACLGroupStore,
    events: {
      success: ACL_GROUP_DETAILS_GROUP_CHANGE,
      error: ACL_GROUP_DETAILS_GROUP_ERROR,
      addUserSuccess: ACL_GROUP_USERS_CHANGED,
      addUserError: ACL_GROUP_ADD_USER_ERROR,
      createSuccess: ACL_GROUP_CREATE_SUCCESS,
      createError: ACL_GROUP_CREATE_ERROR,
      updateError: ACL_GROUP_UPDATE_ERROR,
      updateSuccess: ACL_GROUP_UPDATE_SUCCESS,
      permissionsSuccess: ACL_GROUP_DETAILS_PERMISSIONS_CHANGE,
      permissionsError: ACL_GROUP_DETAILS_PERMISSIONS_ERROR,
      usersSuccess: ACL_GROUP_DETAILS_USERS_CHANGE,
      usersError: ACL_GROUP_DETAILS_USERS_ERROR,
      fetchedDetailsSuccess: ACL_GROUP_DETAILS_FETCHED_SUCCESS,
      fetchedDetailsError: ACL_GROUP_DETAILS_FETCHED_ERROR,
      deleteUserSuccess: ACL_GROUP_REMOVE_USER_SUCCESS,
      deleteUserError: ACL_GROUP_REMOVE_USER_ERROR,
      deleteSuccess: ACL_GROUP_DELETE_SUCCESS,
      deleteError: ACL_GROUP_DELETE_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  users: {
    store: ACLUsersStore,
    events: {
      success: ACL_USERS_CHANGE,
      error: ACL_USERS_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  user: {
    store: ACLUserStore,
    events: {
      success: ACL_USER_DETAILS_USER_CHANGE,
      error: ACL_USER_DETAILS_USER_ERROR,
      permissionsSuccess: ACL_USER_DETAILS_PERMISSIONS_CHANGE,
      permissionsError: ACL_USER_DETAILS_PERMISSIONS_ERROR,
      groupsSuccess: ACL_USER_DETAILS_GROUPS_CHANGE,
      groupsError: ACL_USER_DETAILS_GROUPS_ERROR,
      fetchedDetailsSuccess: ACL_USER_DETAILS_FETCHED_SUCCESS,
      fetchedDetailsError: ACL_USER_DETAILS_FETCHED_ERROR,
      createSuccess: ACL_USER_CREATE_SUCCESS,
      createError: ACL_USER_CREATE_ERROR,
      updateSuccess: ACL_USER_UPDATE_SUCCESS,
      updateError: ACL_USER_UPDATE_ERROR,
      deleteSuccess: ACL_USER_DELETE_SUCCESS,
      deleteError: ACL_USER_DELETE_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  }
};

module.exports = ListenersDescription;
