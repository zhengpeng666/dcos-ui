jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../AppDispatcher");
jest.dontMock("../../config/Config");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../ACLUsersActions");

var ActionTypes = require("../../constants/ActionTypes");
var AppDispatcher = require("../AppDispatcher");
var RequestUtil = require("../../utils/RequestUtil");
var ACLUsersActions = require("../ACLUsersActions");

describe("ACLUsersActions", function () {

  beforeEach(function () {
    this.configuration = null;
    this.requestUtilJSON = RequestUtil.json;
    RequestUtil.json = (configuration) => {
      this.configuration = configuration;
    };
  });

  afterEach(function () {
    RequestUtil.json = this.requestUtilJSON;
  });

  describe("#fetch", function () {

    it("dispatches the correct action when successful", function () {
      ACLUsersActions.fetch();
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USERS_SUCCESS);
      });

      this.configuration.success({foo: "bar"});
    });

    it("dispatches the correct action when unsuccessful", function () {
      ACLUsersActions.fetch();
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USERS_ERROR);
      });

      this.configuration.error({message: "bar"});
    });

    it("calls #json from the RequestUtil", function () {
      spyOn(RequestUtil, "json");
      ACLUsersActions.fetch();
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLUsersActions.fetch();
      expect(RequestUtil.json.mostRecentCall.args[0].url)
        .toEqual("/api/v1/users");
    });

  });

  describe("#fetchUser", function () {

    beforeEach(function () {
      ACLUsersActions.fetchUser("foo");
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

  });

  describe("#fetchUserGroups", function () {

    beforeEach(function () {
      ACLUsersActions.fetchUserGroups("foo");
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
        expect(action.data).toEqual("bar");
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
      ACLUsersActions.fetchUserPermissions("foo");
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
        expect(action.data).toEqual("bar");
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

});
