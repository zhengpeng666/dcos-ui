import _ACLAuthStore from './stores/ACLAuthStore';
import {
  ACL_AUTH_USER_LOGIN_CHANGED,
  ACL_AUTH_USER_LOGIN_ERROR,
  ACL_AUTH_USER_LOGOUT_SUCCESS,
  ACL_AUTH_USER_LOGOUT_ERROR,
  ACL_AUTH_USER_ROLE_CHANGED
} from './constants/EventTypes';

module.exports = (PluginSDK) => {

  let ACLAuthStore = _ACLAuthStore(PluginSDK);

  let StoreMixinConfig = PluginSDK.get('StoreMixinConfig');

  StoreMixinConfig.add('auth', {
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
};
