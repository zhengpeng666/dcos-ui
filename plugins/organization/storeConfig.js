import ACLStore from './submodules/acl/stores/ACLStore';
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
} from './submodules/acl/constants/EventTypes';

// Directories
import ACLDirectoriesStore from './submodules/directories/stores/ACLDirectoriesStore';
import {
  ACL_DIRECTORIES_CHANGED,
  ACL_DIRECTORIES_ERROR,
  ACL_DIRECTORY_ADD_SUCCESS,
  ACL_DIRECTORY_ADD_ERROR,
  ACL_DIRECTORY_DELETE_SUCCESS,
  ACL_DIRECTORY_DELETE_ERROR,
  ACL_DIRECTORY_TEST_SUCCESS,
  ACL_DIRECTORY_TEST_ERROR
} from './submodules/directories/constants/EventTypes';

// Groups
import ACLGroupsStore from './submodules/groups/stores/ACLGroupsStore';
import ACLGroupStore from './submodules/groups/stores/ACLGroupStore';
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
} from './submodules/groups/constants/EventTypes';

// Users
import ACLUsersStore from './submodules/users/stores/ACLUsersStore';
import ACLUserStore from './submodules/users/stores/ACLUserStore';
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
} from './submodules/users/constants/EventTypes';

let SDK = require('./SDK').getSDK();

module.exports = {
  register() {
    let StoreMixinConfig = SDK.get('StoreMixinConfig');

    StoreMixinConfig.add('acl', {
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
    });

    StoreMixinConfig.add('aclDirectories', {
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
    });

    StoreMixinConfig.add('groups', {
      store: ACLGroupsStore,
      events: {
        success: ACL_GROUPS_CHANGE,
        error: ACL_GROUPS_REQUEST_ERROR
      },
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    });

    StoreMixinConfig.add('group', {
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
    });

    StoreMixinConfig.add('users', {
      store: ACLUsersStore,
      events: {
        success: ACL_USERS_CHANGE,
        error: ACL_USERS_REQUEST_ERROR
      },
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    });

    StoreMixinConfig.add('user', {
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
    });
  }
};
