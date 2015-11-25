jest.dontMock("../ACLUsersStore");
jest.dontMock("../../config/Config");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../events/ACLUsersActions");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../structs/User");
jest.dontMock("../../structs/UsersList");
jest.dontMock("../../structs/Item");
jest.dontMock("../../structs/List");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");
jest.dontMock("../../../../tests/_fixtures/acl/users-unicode.json");

let _ = require("underscore");
let ACLUsersStore = require("../ACLUsersStore");
let ActionTypes = require("../../constants/ActionTypes");
let AppDispatcher = require("../../events/AppDispatcher");
let Config = require("../../config/Config");
let EventTypes = require("../../constants/EventTypes");
let usersFixture = require("../../../../tests/_fixtures/acl/users-unicode.json");
let UsersList = require("../../structs/UsersList");
let RequestUtil = require("../../utils/RequestUtil");

describe("ACLUsersStore", function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = function (handlers) {
      handlers.success(usersFixture);
    };
    this.usersFixture = _.clone(usersFixture);
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  it("should return an instance of UsersList", function () {
    Config.useFixtures = true;
    ACLUsersStore.fetchUsers();
    let users = ACLUsersStore.get("users");
    expect(users instanceof UsersList).toBeTruthy();
  });

  it("should return all of the users it was given", function () {
    Config.useFixtures = true;
    ACLUsersStore.fetchUsers();
    let users = ACLUsersStore.get("users").getItems();
    expect(users.length).toEqual(this.usersFixture.length);
  });

  describe("dispatcher", function () {

    it("stores users when event is dispatched", function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_USERS_SUCCESS,
        data: [{gid: "foo", bar: "baz"}]
      });

      let users = ACLUsersStore.get("users").getItems();
      expect(users[0].gid).toEqual("foo");
      expect(users[0].bar).toEqual("baz");
    });

    it("dispatches the correct event upon success", function () {
      let mockedFn = jest.genMockFunction();
      ACLUsersStore.addChangeListener(EventTypes.ACL_USERS_CHANGE, mockedFn);
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_USERS_SUCCESS,
        data: [{gid: "foo", bar: "baz"}]
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

    it("dispatches the correct event upon error", function () {
      let mockedFn = jest.genMockFunction();
      ACLUsersStore.addChangeListener(
        EventTypes.ACL_USERS_REQUEST_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_USERS_ERROR,
        message: "foo"
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

  });

});
