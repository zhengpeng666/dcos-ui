jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../structs/User");
jest.dontMock("../../events/UserActions");
jest.dontMock("../UserDetailStore");
jest.dontMock("../../utils/Store");

var AppDispatcher = require("../../events/AppDispatcher");
var ActionTypes = require("../../constants/ActionTypes");
var EventTypes = require("../../constants/EventTypes");
var UserDetailStore = require("../UserDetailStore");
var UserActions = require("../../events/UserActions");
var User = require("../../structs/User");

describe("UserDetailStore", function () {

  beforeEach(function () {
    UserDetailStore.set({
      users: {},
      usersFetching: {}
    });
  });

  describe("#getUserRaw", function () {

    it("returns the user that was set", function () {
      UserDetailStore.set({users: {foo: {bar: "baz"}}});
      expect(UserDetailStore.getUserRaw("foo")).toEqual({bar: "baz"});
    });

  });

  describe("#getUser", function () {

    it("returns the user that was set", function () {
      UserDetailStore.set({users: {foo: {bar: "baz"}}});
      expect(UserDetailStore.getUser("foo") instanceof User).toBeTruthy();
    });

    it("returns the correct user data", function () {
      UserDetailStore.set({users: {foo: {bar: "baz"}}});
      expect(UserDetailStore.getUser("foo").get()).toEqual({bar: "baz"});
    });

  });

  describe("#setUser", function () {

    it("sets user", function () {
      UserDetailStore.setUser("foo", {bar: "baz"});
      expect(UserDetailStore.get("users")).toEqual({foo: {bar: "baz"}});
    });

  });

  describe("#fetchUserWithDetails", function () {

    beforeEach(function () {
      spyOn(UserActions, "fetchUser");
      spyOn(UserActions, "fetchUserGroups");
      spyOn(UserActions, "fetchUserPermissions");
    });

    it("tracks user as fetching", function () {
      UserDetailStore.fetchUserWithDetails("foo");
      expect(UserDetailStore.get("usersFetching")).toEqual({foo: {
        user: false, groups: false, permissions: false
      }})
    });

    it("calls necessary APIs to fetch users details", function () {
      UserDetailStore.fetchUserWithDetails("foo");
      expect(UserActions.fetchUser).toHaveBeenCalled();
      expect(UserActions.fetchUserGroups).toHaveBeenCalled();
      expect(UserActions.fetchUserPermissions).toHaveBeenCalled();
    });

  });

  describe("dispatcher", function () {

    describe("user", function () {

      it("stores user when event is dispatched", function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_SUCCESS,
          data: {uid: "foo", bar: "baz"}
        });

        expect(UserDetailStore.getUserRaw("foo"))
          .toEqual({uid: "foo", bar: "baz"});
      });

      it("emits event after success event is dispatched", function () {
        UserDetailStore.addChangeListener(EventTypes.USER_DETAILS_USER_CHANGE,
          function (id) {
            expect(id).toEqual("foo");
            UserDetailStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_SUCCESS,
          data: {uid: "foo"}
        });
      });

      it("emits event after error event is dispatched", function () {
        UserDetailStore.addChangeListener(EventTypes.USER_DETAILS_USER_ERROR,
          function (id) {
            expect(id).toEqual("foo");
            UserDetailStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_ERROR,
          userID: "foo"
        });
      });

    });

    describe("groups", function () {

      it("stores groups when event is dispatched", function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GROUPS_SUCCESS,
          data: {bar: "baz"},
          userID: "foo"
        });

        expect(UserDetailStore.getUserRaw("foo"))
          .toEqual({groups: {bar: "baz"}});
      });

      it("emits event after success event is dispatched", function () {
        UserDetailStore.addChangeListener(
          EventTypes.USER_DETAILS_GROUPS_CHANGE,
          function (id) {
            expect(id).toEqual("foo");
            UserDetailStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GROUPS_SUCCESS,
          userID: "foo"
        });
      });

      it("emits event after error event is dispatched", function () {
        UserDetailStore.addChangeListener(
          EventTypes.USER_DETAILS_GROUPS_ERROR,
          function (id) {
            expect(id).toEqual("foo");
            UserDetailStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GROUPS_ERROR,
          userID: "foo"
        });
      });

    });

    describe("permissions", function () {

      it("stores permissions when event is dispatched", function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_SUCCESS,
          data: {bar: "baz"},
          userID: "foo"
        });

        expect(UserDetailStore.getUserRaw("foo"))
          .toEqual({permissions: {bar: "baz"}});
      });

      it("emits event after success event is dispatched", function () {
        UserDetailStore.addChangeListener(
          EventTypes.USER_DETAILS_PERMISSIONS_CHANGE,
          function (id) {
            expect(id).toEqual("foo");
            UserDetailStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_SUCCESS,
          userID: "foo"
        });
      });

      it("emits event after error event is dispatched", function () {
        UserDetailStore.addChangeListener(
          EventTypes.USER_DETAILS_PERMISSIONS_ERROR,
          function (id) {
            expect(id).toEqual("foo");
            UserDetailStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_ERROR,
          userID: "foo"
        });
      });

    });

  });

});
