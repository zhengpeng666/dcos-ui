jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../structs/User");
jest.dontMock("../../events/ACLUsersActions");
jest.dontMock("../ACLUserStore");
jest.dontMock("../../utils/Store");

var ACLUsersActions = require("../../events/ACLUsersActions");
var ACLUserStore = require("../ACLUserStore");
var AppDispatcher = require("../../events/AppDispatcher");
var ActionTypes = require("../../constants/ActionTypes");
var EventTypes = require("../../constants/EventTypes");
var User = require("../../structs/User");

describe("ACLUserStore", function () {

  beforeEach(function () {
    ACLUserStore.set({
      users: {},
      usersFetching: {}
    });
  });

  describe("#getUserRaw", function () {

    it("returns the user that was set", function () {
      ACLUserStore.set({users: {foo: {bar: "baz"}}});
      expect(ACLUserStore.getUserRaw("foo")).toEqual({bar: "baz"});
    });

  });

  describe("#getUser", function () {

    it("returns the user that was set", function () {
      ACLUserStore.set({users: {foo: {bar: "baz"}}});
      expect(ACLUserStore.getUser("foo") instanceof User).toBeTruthy();
    });

    it("returns the correct user data", function () {
      ACLUserStore.set({users: {foo: {bar: "baz"}}});
      expect(ACLUserStore.getUser("foo").get()).toEqual({bar: "baz"});
    });

  });

  describe("#setUser", function () {

    it("sets user", function () {
      ACLUserStore.setUser("foo", {bar: "baz"});
      expect(ACLUserStore.get("users")).toEqual({foo: {bar: "baz"}});
    });

  });

  describe("#fetchUserWithDetails", function () {

    beforeEach(function () {
      spyOn(ACLUsersActions, "fetchUser");
      spyOn(ACLUsersActions, "fetchUserGroups");
      spyOn(ACLUsersActions, "fetchUserPermissions");
    });

    it("tracks user as fetching", function () {
      ACLUserStore.fetchUserWithDetails("foo");
      expect(ACLUserStore.get("usersFetching")).toEqual({foo: {
        user: false, groups: false, permissions: false
      }});
    });

    it("calls necessary APIs to fetch users details", function () {
      ACLUserStore.fetchUserWithDetails("foo");
      expect(ACLUsersActions.fetchUser).toHaveBeenCalled();
      expect(ACLUsersActions.fetchUserGroups).toHaveBeenCalled();
      expect(ACLUsersActions.fetchUserPermissions).toHaveBeenCalled();
    });

  });

  describe("dispatcher", function () {

    afterEach(function () {
      ACLUserStore.removeAllListeners();
    });

    describe("user", function () {

      it("stores user when event is dispatched", function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_SUCCESS,
          data: {uid: "foo", bar: "baz"}
        });

        expect(ACLUserStore.getUserRaw("foo"))
          .toEqual({uid: "foo", bar: "baz"});
      });

      it("emits event after success event is dispatched", function () {
        ACLUserStore.addChangeListener(EventTypes.ACL_USER_DETAILS_USER_CHANGE,
          function (id) {
            expect(id).toEqual("foo");
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_SUCCESS,
          data: {uid: "foo"}
        });
      });

      it("emits event after error event is dispatched", function () {
        ACLUserStore.addChangeListener(EventTypes.ACL_USER_DETAILS_USER_ERROR,
          function (id) {
            expect(id).toEqual("foo");
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

        expect(ACLUserStore.getUserRaw("foo"))
          .toEqual({groups: {bar: "baz"}});
      });

      it("emits event after success event is dispatched", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_DETAILS_GROUPS_CHANGE,
          function (id) {
            expect(id).toEqual("foo");
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GROUPS_SUCCESS,
          userID: "foo"
        });
      });

      it("emits event after error event is dispatched", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_DETAILS_GROUPS_ERROR,
          function (id) {
            expect(id).toEqual("foo");
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

        expect(ACLUserStore.getUserRaw("foo"))
          .toEqual({permissions: {bar: "baz"}});
      });

      it("emits event after success event is dispatched", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_DETAILS_PERMISSIONS_CHANGE,
          function (id) {
            expect(id).toEqual("foo");
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_SUCCESS,
          userID: "foo"
        });
      });

      it("emits event after error event is dispatched", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_DETAILS_PERMISSIONS_ERROR,
          function (id) {
            expect(id).toEqual("foo");
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_ERROR,
          userID: "foo"
        });
      });

    });

    describe("create", function () {

      it("emits event after success event is dispatched", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_CREATE_SUCCESS,
          function () {
            expect(true).toEqual(true);
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_CREATE_SUCCESS
        });
      });

      it("emits event after error event is dispatched", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_CREATE_ERROR,
          function () {
            expect(true).toEqual(true);
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_CREATE_ERROR
        });
      });

    });

    describe("update", function () {

      it("emits event after success event is dispatched", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_UPDATE_SUCCESS,
          function () {
            expect(true).toEqual(true);
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_UPDATE_SUCCESS
        });
      });

      it("emits success event with the userID", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_DELETE_SUCCESS,
          function (userID) {
            expect(userID).toEqual("foo");
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_UPDATE_SUCCESS,
          userID: "foo"
        });
      });

      it("emits event after error event is dispatched", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_UPDATE_ERROR,
          function () {
            expect(true).toEqual(true);
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_UPDATE_ERROR
        });
      });

      it("emits error event with the userID", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_DELETE_SUCCESS,
          function (userID) {
            expect(userID).toEqual("foo");
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_UPDATE_ERROR,
          userID: "foo"
        });
      });

    });

    describe("delete", function () {

      it("emits event after success event is dispatched", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_DELETE_SUCCESS,
          function () {
            expect(true).toEqual(true);
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_DELETE_SUCCESS
        });
      });

      it("emits success event with the userID", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_DELETE_SUCCESS,
          function (userID) {
            expect(userID).toEqual("foo");
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_DELETE_SUCCESS,
          userID: "foo"
        });
      });

      it("emits event after error event is dispatched", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_DELETE_ERROR,
          function () {
            expect(true).toEqual(true);
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_DELETE_ERROR
        });
      });

      it("emits error event with the userID", function () {
        ACLUserStore.addChangeListener(
          EventTypes.ACL_USER_DELETE_SUCCESS,
          function (userID) {
            expect(userID).toEqual("foo");
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_DELETE_ERROR,
          userID: "foo"
        });
      });

    });

  });

});
