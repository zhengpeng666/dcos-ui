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
