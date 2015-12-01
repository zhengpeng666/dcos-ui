jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../AppDispatcher");
jest.dontMock("../../config/Config");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../ACLUsersActions");

var ActionTypes = require("../../constants/ActionTypes");
var ACLUsersActions = require("../ACLUsersActions");
var AppDispatcher = require("../AppDispatcher");
let Config = require("../../config/Config");
var RequestUtil = require("../../utils/RequestUtil");

describe("ACLUsersActions", function () {

  describe("#fetch", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLUsersActions.fetch();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("dispatches the correct action when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USERS_SUCCESS);
      });

      this.configuration.success({foo: "bar"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USERS_ERROR);
      });

      this.configuration.error({message: "bar"});
    });

    it("calls #json from the RequestUtil", function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      expect(this.configuration.url).toEqual("/api/v1/users");
    });

  });

  describe("#fetchUser", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLUsersActions.fetchUser("foo");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("dispatches the correct action when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USER_SUCCESS);
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches with the correct data when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual({bar: "baz"});
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USER_ERROR);
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches with the correct data when unsucessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches with the userID when unsucessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual("foo");
      });

      this.configuration.error({message: "bar"});
    });

  });

  describe("#fetchUserGroups", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLUsersActions.fetchUserGroups("foo");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("dispatches the correct action when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_GROUPS_SUCCESS);
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches with the correct data when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual({bar: "baz"});
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches with the userID successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual("foo");
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USER_GROUPS_ERROR);
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches with the correct data when unsucessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual("foo");
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches with the userID when unsucessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({message: "bar"});
    });

  });

  describe("#fetchUserPermissions", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLUsersActions.fetchUserPermissions("foo");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("dispatches the correct action when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_PERMISSIONS_SUCCESS);
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches with the correct data when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual({bar: "baz"});
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches with the userID successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual("foo");
      });

      this.configuration.success({bar: "baz"});
    });

    it("dispatches the correct action when unsucessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_PERMISSIONS_ERROR);
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches with the correct data when unsucessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual("foo");
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches with the userID when unsucessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({message: "bar"});
    });

  });

  describe("#addUser", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLUsersActions.addUser({uid: "foo"});
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("calls #json from the RequestUtil", function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      expect(this.configuration.url).toEqual("/api/v1/users/foo");
    });

    it("uses PUT for the request method", function () {
      expect(this.configuration.type).toEqual("PUT");
    });

    it("dispatches the correct action when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_CREATE_SUCCESS);
      });

      this.configuration.success({foo: "bar"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_CREATE_ERROR);
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches the correct message when unsuccessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({message: "bar"});
    });

  });

  describe("#updateUser", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLUsersActions.updateUser({uid: "foo"});
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("calls #json from the RequestUtil", function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      expect(this.configuration.url).toEqual("/api/v1/users/foo");
    });

    it("uses PATCH for the request method", function () {
      expect(this.configuration.type).toEqual("PATCH");
    });

    it("dispatches the correct action when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_UPDATE_SUCCESS);
      });

      this.configuration.success({foo: "bar"});
    });

    it("dispatches the userID when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual("foo");
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_UPDATE_ERROR);
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches the correct message when unsuccessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches the userID when unsuccessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual("foo");
      });

      this.configuration.error({message: "bar"});
    });

  });

  describe("#deleteUser", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLUsersActions.updateUser({uid: "foo"});
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("calls #json from the RequestUtil", function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      expect(this.configuration.url).toEqual("/api/v1/users/foo");
    });

    it("uses DELETE for the request method", function () {
      expect(this.configuration.type).toEqual("DELETE");
    });

    it("dispatches the correct action when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_DELETE_SUCCESS);
      });

      this.configuration.success({foo: "bar"});
    });

    it("dispatches the userID when successful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual("foo");
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_DELETE_ERROR);
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches the correct message when unsuccessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({message: "bar"});
    });

    it("dispatches the userID when unsuccessful", function () {
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual("foo");
      });

      this.configuration.error({message: "bar"});
    });

  });

});
