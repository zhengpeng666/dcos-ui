jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../structs/User");
jest.dontMock("../../events/ACLGroupActions");
jest.dontMock("../ACLGroupStore");
jest.dontMock("../../utils/Store");

var ACLGroupActions = require("../../events/ACLGroupActions");
var ACLGroupStore = require("../ACLGroupStore");
var AppDispatcher = require("../../events/AppDispatcher");
var ActionTypes = require("../../constants/ActionTypes");
var EventTypes = require("../../constants/EventTypes");
var Group = require("../../structs/Group");

describe("ACLGroupStore", function () {

  beforeEach(function () {
    ACLGroupStore.set({
      groups: {},
      groupsFetching: {}
    });
  });

  describe("#getGroupRaw", function () {

    it("returns the group that was set", function () {
      ACLGroupStore.set({groups: {foo: {bar: "baz"}}});
      expect(ACLGroupStore.getGroupRaw("foo")).toEqual({bar: "baz"});
    });

  });

  describe("#getGroup", function () {

    it("returns the group that was set", function () {
      ACLGroupStore.set({groups: {foo: {bar: "baz"}}});
      expect(ACLGroupStore.getGroup("foo") instanceof Group).toBeTruthy();
    });

    it("returns the correct group data", function () {
      ACLGroupStore.set({groups: {foo: {bar: "baz"}}});
      expect(ACLGroupStore.getGroup("foo").get()).toEqual({bar: "baz"});
    });

  });

  describe("#setGroup", function () {

    it("sets group", function () {
      ACLGroupStore.setGroup("foo", {bar: "baz"});
      expect(ACLGroupStore.get("groups")).toEqual({foo: {bar: "baz"}});
    });

  });

  describe("#fetchGroupWithDetails", function () {

    beforeEach(function () {
      spyOn(ACLGroupActions, "fetchGroup");
      spyOn(ACLGroupActions, "fetchGroupUsers");
      spyOn(ACLGroupActions, "fetchGroupPermissions");
    });

    it("tracks group as fetching", function () {
      ACLGroupStore.fetchGroupWithDetails("foo");
      expect(ACLGroupStore.get("groupsFetching")).toEqual({foo: {
        group: false, users: false, permissions: false
      }});
    });

    it("calls necessary APIs to fetch groups details", function () {
      ACLGroupStore.fetchGroupWithDetails("foo");
      expect(ACLGroupActions.fetchGroup).toHaveBeenCalled();
      expect(ACLGroupActions.fetchGroupUsers).toHaveBeenCalled();
      expect(ACLGroupActions.fetchGroupPermissions).toHaveBeenCalled();
    });

  });

  describe("dispatcher", function () {

    describe("group", function () {

      it("stores group when event is dispatched", function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DETAILS_GROUP_SUCCESS,
          data: {gid: "foo", bar: "baz"}
        });

        expect(ACLGroupStore.getGroupRaw("foo"))
          .toEqual({gid: "foo", bar: "baz"});
      });

      it("emits event after success event is dispatched", function () {
        ACLGroupStore.addChangeListener(EventTypes.GROUP_DETAILS_GROUP_CHANGE,
          function (id) {
            expect(id).toEqual("foo");
            ACLGroupStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DETAILS_GROUP_SUCCESS,
          data: {gid: "foo"}
        });
      });

      it("emits event after error event is dispatched", function () {
        ACLGroupStore.addChangeListener(EventTypes.GROUP_DETAILS_GROUP_ERROR,
          function (id) {
            expect(id).toEqual("foo");
            ACLGroupStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DETAILS_GROUP_ERROR,
          groupID: "foo"
        });
      });

    });

    describe("users", function () {

      it("stores users when event is dispatched", function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DETAILS_USERS_SUCCESS,
          data: {bar: "baz"},
          groupID: "foo"
        });

        expect(ACLGroupStore.getGroupRaw("foo"))
          .toEqual({users: {bar: "baz"}});
      });

      it("emits event after success event is dispatched", function () {
        ACLGroupStore.addChangeListener(
          EventTypes.GROUP_DETAILS_USERS_CHANGE,
          function (id) {
            expect(id).toEqual("foo");
            ACLGroupStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DETAILS_USERS_SUCCESS,
          groupID: "foo"
        });
      });

      it("emits event after error event is dispatched", function () {
        ACLGroupStore.addChangeListener(
          EventTypes.GROUP_DETAILS_USERS_ERROR,
          function (id) {
            expect(id).toEqual("foo");
            ACLGroupStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DETAILS_USERS_ERROR,
          groupID: "foo"
        });
      });

    });

    describe("permissions", function () {

      it("stores permissions when event is dispatched", function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DETAILS_PERMISSIONS_SUCCESS,
          data: {bar: "baz"},
          groupID: "foo"
        });

        expect(ACLGroupStore.getGroupRaw("foo"))
          .toEqual({permissions: {bar: "baz"}});
      });

      it("emits event after success event is dispatched", function () {
        ACLGroupStore.addChangeListener(
          EventTypes.GROUP_DETAILS_PERMISSIONS_CHANGE,
          function (id) {
            expect(id).toEqual("foo");
            ACLGroupStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DETAILS_PERMISSIONS_SUCCESS,
          groupID: "foo"
        });
      });

      it("emits event after error event is dispatched", function () {
        ACLGroupStore.addChangeListener(
          EventTypes.GROUP_DETAILS_PERMISSIONS_ERROR,
          function (id) {
            expect(id).toEqual("foo");
            ACLGroupStore.removeAllListeners();
          }
        );

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DETAILS_PERMISSIONS_ERROR,
          groupID: "foo"
        });
      });

    });

  });

});
