import cookie from "cookie";

import ActionTypes from "../constants/ActionTypes";
import ACLAuthConstants from "../constants/ACLAuthConstants";
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
        if (Config.environment === "testing") {
          global.document.cookie =
            cookie.serialize(ACLAuthConstants.userCookieKey,
              "eyJ1aWQiOiJqb2UiLCJkZXNjcmlwdGlvbiI6IkpvZSBEb2UifQ=="
            );
        }

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_LOGIN_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_LOGIN_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  }

};

if (Config.useFixtures) {
  ACLAuthActions.login = function () {
    global.document.cookie =
      "dcos-acs-info-cookie=" +
        "eyJ1aWQiOiJqb2UiLCJkZXNjcmlwdGlvbiI6IkpvZSBEb2UifQ==";
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_LOGIN_SUCCESS
    });
  };
}

export default ACLAuthActions;
