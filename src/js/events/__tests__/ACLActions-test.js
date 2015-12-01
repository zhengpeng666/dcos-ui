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
          type: ActionTypes.REQUEST_ACL_SUCCESS,
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
          type: ActionTypes.REQUEST_ACL_ERROR,
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
        .toEqual("http://mesosserver/acls?type=bar");
    });
  });

  describe("#grantUserActionToResource", function () {

    beforeEach(function () {
      ACLActions.grantUserActionToResource("access", "foo", "bar");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_GRANT_USER_ACTION_SUCCESS,
            userID: "foo",
            resourceID: "bar"
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
            type: ActionTypes.REQUEST_ACL_GRANT_USER_ACTION_ERROR,
            data: {error: "bar"},
            userID: "foo",
            resourceID: "bar"
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantUserActionToResource("access", "foo", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/acls/bar/users/foo/access");
    });

    it("sends a PUT request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantUserActionToResource("access", "foo", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("PUT");
    });

  });

  describe("#revokeUserActionToResource", function () {

    beforeEach(function () {
      ACLActions.revokeUserActionToResource("access", "foo", "bar");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_REVOKE_USER_ACTION_SUCCESS,
            userID: "foo",
            resourceID: "bar"
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
            type: ActionTypes.REQUEST_ACL_REVOKE_USER_ACTION_ERROR,
            data: {error: "bar"},
            userID: "foo",
            resourceID: "bar"
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeUserActionToResource("access", "foo", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/acls/bar/users/foo/access");
    });

    it("sends a DELETE request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeUserActionToResource("access", "foo", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("DELETE");
    });

  });

  describe("#grantGroupActionToResource", function () {

    beforeEach(function () {
      ACLActions.grantGroupActionToResource("access", "foo", "bar");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_GRANT_GROUP_ACTION_SUCCESS,
            groupID: "foo",
            resourceID: "bar"
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
            type: ActionTypes.REQUEST_ACL_GRANT_GROUP_ACTION_ERROR,
            data: {error: "bar"},
            groupID: "foo",
            resourceID: "bar"
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantGroupActionToResource("access", "foo", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/acls/bar/groups/foo/access");
    });

    it("sends a PUT request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.grantGroupActionToResource("access", "foo", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("PUT");
    });

  });

  describe("#revokeGroupActionToResource", function () {

    beforeEach(function () {
      ACLActions.revokeGroupActionToResource("access", "foo", "bar");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action)
          .toEqual({
            type: ActionTypes.REQUEST_ACL_REVOKE_GROUP_ACTION_SUCCESS,
            groupID: "foo",
            resourceID: "bar"
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
            type: ActionTypes.REQUEST_ACL_REVOKE_GROUP_ACTION_ERROR,
            data: {error: "bar"},
            groupID: "foo",
            resourceID: "bar"
          });
      });

      this.configuration.error({error: "bar"});
    });

    it("sends data to the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeGroupActionToResource("access", "foo", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.url)
        .toEqual("http://mesosserver/acls/bar/groups/foo/access");
    });

    it("sends a DELETE request", function () {
      spyOn(RequestUtil, "json");
      ACLActions.revokeUserActionToResource("access", "foo", "bar");
      var requestArgs = RequestUtil.json.mostRecentCall.args[0];
      expect(requestArgs.type).toEqual("DELETE");
    });

  });

});
