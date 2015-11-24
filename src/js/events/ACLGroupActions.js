import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";
import groupsFixture from "json!../../../tests/_fixtures/acl/groups-unicode.json";

const ACLGroupActions = {

  fetch: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function () {
        RequestUtil.json({
          url: `${Config.rootUrl}/groups`,
          success: function (response) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_ACL_GROUPS_SUCCESS,
              data: response
            });
            resolve();
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_ACL_GROUPS_ERROR,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_ACL_GROUPS_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  )

};

let useFixtures = true;

if (useFixtures) {
  ACLGroupActions.fetch = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUPS_SUCCESS,
      data: groupsFixture
    });
  };
}

export default ACLGroupActions;
