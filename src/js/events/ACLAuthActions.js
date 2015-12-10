import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";

const ACLAuthActions = {

  login: function (credentials) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/auth/login`,
      type: "POST",
      data: credentials,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_LOGIN_SUCCESS
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_LOGIN_ERROR,
          data: e.error
        });
      }
    });
  }

};

if (Config.useFixtures) {
  ACLAuthActions.login = function () {
    global.document.cookie =
      "ACLMetadata=eyJkZXNjcmlwdGlvbiI6IkpvaG4gRG9lIn0=";
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_LOGIN_SUCCESS
    });
  };
}

export default ACLAuthActions;
