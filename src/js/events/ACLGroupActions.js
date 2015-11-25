import ACLActionTypes from "../constants/ACLActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";
import groupsFixture from "json!../../../tests/_fixtures/acl/groups-unicode.json";

const ACLGroupActions = {

  fetch: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/groups`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ACLActionTypes.REQUEST_ACL_GROUPS_SUCCESS,
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ACLActionTypes.REQUEST_ACL_GROUPS_ERROR,
          data: e.message
        });
      }
    });
  }

};

if (Config.useFixtures) {
  ACLGroupActions.fetch = function () {
    AppDispatcher.handleServerAction({
      type: ACLActionTypes.REQUEST_ACL_GROUPS_SUCCESS,
      data: groupsFixture
    });
  };
}

export default ACLGroupActions;
