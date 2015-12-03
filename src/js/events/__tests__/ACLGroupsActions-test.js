jest.dontMock("../ACLGroupsActions");
jest.dontMock("../AppDispatcher");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../utils/RequestUtil");

var ACLGroupsActions = require("../ACLGroupsActions");
var ActionTypes = require("../../constants/ActionTypes");
var AppDispatcher = require("../AppDispatcher");
var RequestUtil = require("../../utils/RequestUtil");

describe("ACLGroupsActions", function () {

  describe("#fetch", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLGroupsActions.fetch();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("dispatches the correct action when successful", function () {
      ACLGroupsActions.fetch();
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_GROUPS_SUCCESS);
      });

      this.configuration.success({foo: "bar"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      ACLGroupsActions.fetch();
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_GROUPS_ERROR);
      });

      this.configuration.error({error: "bar"});
    });

    it("calls #json from the RequestUtil", function () {
      ACLGroupsActions.fetch();
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      ACLGroupsActions.fetch();
      expect(this.configuration.url)
        .toEqual("/api/v1/groups");
    });

  });

  describe("#fetchGroup", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLGroupsActions.fetchGroup("foo");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_GROUP_SUCCESS);
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches with the correct data when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual({bar: "baz"});
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_GROUP_ERROR);
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches with the correct data when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches with the groupID when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.error({error: "bar"});
    });

  });

  describe("#fetchGroupUsers", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLGroupsActions.fetchGroupUsers("foo");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_GROUP_USERS_SUCCESS);
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches with the correct data when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual({bar: "baz"});
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches with the groupID successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_GROUP_USERS_ERROR);
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches with the correct data when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches with the groupID when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.error({error: "bar"});
    });

  });

  describe("#fetchGroupPermissions", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLGroupsActions.fetchGroupPermissions("foo");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS);
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches with the correct data when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual({bar: "baz"});
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches with the groupID successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_ERROR);
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches with the correct data when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches with the groupID when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.error({error: "bar"});
    });

  });

  describe("#addGroup", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLGroupsActions.addGroup({gid: "foo"});
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("calls #json from the RequestUtil", function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      expect(this.configuration.url).toEqual("/api/v1/groups/foo");
    });

    it("uses PUT for the request method", function () {
      expect(this.configuration.type).toEqual("PUT");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_GROUP_CREATE_SUCCESS);
      });

      this.configuration.success({foo: "bar"});
    });

    it("dispatches the correct groupID when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.success({foo: "bar"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_GROUP_CREATE_ERROR);
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches the correct message when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches the correct groupID when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.error({error: "bar"});
    });

  });

  describe("#updateGroup", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLGroupsActions.updateGroup("foo");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("calls #json from the RequestUtil", function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      expect(this.configuration.url).toEqual("/api/v1/groups/foo");
    });

    it("uses PATCH for the request method", function () {
      expect(this.configuration.type).toEqual("PATCH");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_GROUP_UPDATE_SUCCESS);
      });

      this.configuration.success({foo: "bar"});
    });

    it("dispatches the groupID when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_GROUP_UPDATE_ERROR);
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches the correct message when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches the groupID when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.error({error: "bar"});
    });

  });

  describe("#deleteGroup", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLGroupsActions.deleteGroup("foo");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("calls #json from the RequestUtil", function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      expect(this.configuration.url).toEqual("/api/v1/groups/foo");
    });

    it("uses DELETE for the request method", function () {
      expect(this.configuration.type).toEqual("DELETE");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_GROUP_DELETE_SUCCESS);
      });

      this.configuration.success({foo: "bar"});
    });

    it("dispatches the groupID when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_GROUP_DELETE_ERROR);
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches the correct message when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({error: "bar"});
    });

    it("dispatches the groupID when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.groupID).toEqual("foo");
      });

      this.configuration.error({error: "bar"});
    });

  });

  describe("#addUser", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLGroupsActions.addUser("foo", "bar");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_ACL_GROUP_ADD_USER_SUCCESS,
          data: {bar: "baz"},
          userID: "bar",
          groupID: "foo"
        });
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_ACL_GROUP_ADD_USER_ERROR,
          data: "bar",
          userID: "bar",
          groupID: "foo"
        });
      });

      this.configuration.error({error: "bar"});
    });

  });

  describe("#removeUser", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLGroupsActions.removeUser("foo", "bar");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS,
          data: {bar: "baz"},
          userID: "bar",
          groupID: "foo"
        });
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_ERROR,
          data: "bar",
          userID: "bar",
          groupID: "foo"
        });
      });

      this.configuration.error({error: "bar"});
    });

  });

});
