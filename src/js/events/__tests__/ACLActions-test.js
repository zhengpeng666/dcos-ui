jest.dontMock("../ACLActions");
jest.dontMock("../AppDispatcher");
jest.dontMock("../../config/Config");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../utils/RequestUtil");

let ACLActions = require("../ACLActions");
let ActionTypes = require("../../constants/ActionTypes");
var AppDispatcher = require("../AppDispatcher");
let Config = require("../../config/Config");
let RequestUtil = require("../../utils/RequestUtil");

describe("ACLActions", function () {

  beforeEach(function () {
    this.configuration = null;
    this.requestUtilJSON = RequestUtil.json;
    RequestUtil.json = function (configuration) {
      this.configuration = configuration;
    }.bind(this);
    Config.rootUrl = "http://mesosserver";
    Config.useFixtures = false;
  });

  afterEach(function () {
    RequestUtil.json = this.requestUtilJSON;
  });

  describe("#fetchACLs", function () {

    it("dispatches the correct action when successful", function () {
      ACLActions.fetchACLs("foo");
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_ACL_RESOURCE_SUCCESS,
          data: {foo: "foo"}
        });
      });

      this.configuration.success({foo: "foo"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      ACLActions.fetchACLs("bar");
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ERROR,
          data: {error: "bar"}
        });
      });

      this.configuration.error({error: "bar"});
    });

    it("calls #json from the RequestUtil", function () {
      spyOn(RequestUtil, "json");
      ACLActions.fetchACLs("foo");
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.fetchACLs("bar");
      expect(RequestUtil.json.mostRecentCall.args[0].url)
        .toEqual("http://mesosserver/api/v1/acls?type=bar");
    });
  });

  describe("#grantUserActionToResource", function () {

    beforeEach(function () {
      ACLActions.grantUserActionToResource("foo", "bar", "access");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
            data: {userID: "foo", resourceID: "bar", action: "access"}
          });
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_ERROR,
            data: {
              userID: "foo",
              resourceID: "bar",
              action: "access",
              error: {error: "bar"}
            }
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantUserActionToResource("foo", "bar", "access");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/api/v1/acls/bar/users/foo/access");
    });

    it("sends a PUT request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantUserActionToResource("foo", "bar", "access");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("PUT");
    });

  });

  describe("#revokeUserActionToResource", function () {

    beforeEach(function () {
      ACLActions.revokeUserActionToResource("foo", "bar", "access");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
            data: {userID: "foo", resourceID: "bar", action: "access"}
          });
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_ERROR,
            data: {
              userID: "foo",
              resourceID: "bar",
              action: "access",
              error: {error: "bar"}
            }
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeUserActionToResource("foo", "bar", "access");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/api/v1/acls/bar/users/foo/access");
    });

    it("sends a DELETE request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeUserActionToResource("foo", "bar", "access");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("DELETE");
    });

  });

  describe("#grantGroupActionToResource", function () {

    beforeEach(function () {
      ACLActions.grantGroupActionToResource("foo", "bar", "access");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
            data: {groupID: "foo", resourceID: "bar", action: "access"}
          });
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_ERROR,
            data: {
              groupID: "foo",
              resourceID: "bar",
              action: "access",
              error: {error: "bar"}
            }
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantGroupActionToResource("foo", "bar", "access");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/api/v1/acls/bar/groups/foo/access");
    });

    it("sends a PUT request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantGroupActionToResource("foo", "bar", "access");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("PUT");
    });

  });

  describe("#revokeGroupActionToResource", function () {

    beforeEach(function () {
      ACLActions.revokeGroupActionToResource("foo", "bar", "access");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
            data: {groupID: "foo", resourceID: "bar", action: "access"}
          });
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR,
            data: {
              groupID: "foo",
              resourceID: "bar",
              action: "access",
              error: {error: "bar"}
            }
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeGroupActionToResource("foo", "bar", "access");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/api/v1/acls/bar/groups/foo/access");
    });

    it("sends a DELETE request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeUserActionToResource("foo", "bar", "access");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("DELETE");
    });

  });

});
