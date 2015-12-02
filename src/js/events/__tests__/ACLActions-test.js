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

  describe("#fetchACLsForResource", function () {

    it("dispatches the correct action when successful", function () {
      ACLActions.fetchACLsForResource("foo");
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
          data: {bar: "baz"},
          resourceType: "foo"
        });
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      ACLActions.fetchACLsForResource("bar");
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_ERROR,
          data: "bar",
          resourceType: "bar"
        });
      });

      this.configuration.error({error: "bar"});
    });

    it("calls #json from the RequestUtil", function () {
      spyOn(RequestUtil, "json");
      ACLActions.fetchACLsForResource("foo");
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.fetchACLsForResource("bar");
      expect(RequestUtil.json.mostRecentCall.args[0].url)
        .toEqual("http://mesosserver/api/v1/acls?type=bar");
    });
  });

  describe("#grantUserActionToResource", function () {

    beforeEach(function () {
      ACLActions.grantUserActionToResource("foo", "access", "bar");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
            data: {bar: "baz"},
            triple: {userID: "foo", action: "access", resourceID: "bar"}
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
            data: "bar",
            triple: {userID: "foo", action: "access", resourceID: "bar"}
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantUserActionToResource("foo", "access", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/api/v1/acls/bar/users/foo/access");
    });

    it("sends a PUT request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantUserActionToResource("foo", "access", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("PUT");
    });

  });

  describe("#revokeUserActionToResource", function () {

    beforeEach(function () {
      ACLActions.revokeUserActionToResource("foo", "access", "bar");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
            data: {bar: "baz"},
            triple: {userID: "foo", action: "access", resourceID: "bar"}
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
            data: "bar",
            triple: {userID: "foo", action: "access", resourceID: "bar"}
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeUserActionToResource("foo", "access", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/api/v1/acls/bar/users/foo/access");
    });

    it("sends a DELETE request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeUserActionToResource("foo", "access", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("DELETE");
    });

  });

  describe("#grantGroupActionToResource", function () {

    beforeEach(function () {
      ACLActions.grantGroupActionToResource("foo", "access", "bar");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
            data: {bar: "baz"},
            triple: {groupID: "foo", action: "access", resourceID: "bar"}
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
            data: "bar",
            triple: {groupID: "foo", action: "access", resourceID: "bar"}
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantGroupActionToResource("foo", "access", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/api/v1/acls/bar/groups/foo/access");
    });

    it("sends a PUT request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantGroupActionToResource("foo", "access", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("PUT");
    });

  });

  describe("#revokeGroupActionToResource", function () {

    beforeEach(function () {
      ACLActions.revokeGroupActionToResource("foo", "access", "bar");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
            data: {bar: "baz"},
            triple: {groupID: "foo", action: "access", resourceID: "bar"}
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
            data: "bar",
            triple: {groupID: "foo", resourceID: "bar", action: "access"}
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeGroupActionToResource("foo", "access", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/api/v1/acls/bar/groups/foo/access");
    });

    it("sends a DELETE request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeUserActionToResource("foo", "access", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("DELETE");
    });

  });

});
