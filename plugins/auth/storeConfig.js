import StoreMixinConfig from 'StoreMixinConfig';

import _ACLAuthStore from './stores/ACLAuthStore';
import {
  ACL_AUTH_USER_LOGIN_CHANGED,
  ACL_AUTH_USER_LOGIN_ERROR,
  ACL_AUTH_USER_LOGOUT_SUCCESS,
  ACL_AUTH_USER_LOGOUT_ERROR,
  ACL_AUTH_USER_ROLE_CHANGED
} from './constants/EventTypes';

import _ACLStore from './submodules/acl/stores/ACLStore';
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

module.exports = {

  register(PluginSDK) {

    let ACLAuthStore = _ACLAuthStore(PluginSDK);
    let ACLStore = _ACLStore(PluginSDK);

    // Register our Stores
    StoreMixinConfig.addConfig('auth', {
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
    });

    StoreMixinConfig.addConfig('acl', {
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
  }
};

