jest.dontMock("underscore");
jest.dontMock("../GroupsStore");
jest.dontMock("../../config/Config");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../events/ACLGroupActions");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../structs/Group");
jest.dontMock("../../structs/GroupsList");
jest.dontMock("../../structs/Item");
jest.dontMock("../../structs/List");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");
jest.dontMock("../../../../tests/_fixtures/acl/groups-unicode.json");

let _ = require("underscore");
let Config = require("../../config/Config");
let groupsFixture = require("../../../../tests/_fixtures/acl/groups-unicode.json");
let GroupsList = require("../../structs/GroupsList");
let GroupsStore = require("../GroupsStore");
let RequestUtil = require("../../utils/RequestUtil");

describe("GroupsStore", function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = function (handlers) {
      handlers.success(groupsFixture);
    };
    this.groupsFixture = _.clone(groupsFixture);
    GroupsStore.init();
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  describe("#getGroups", function () {

    it("should return an instance of GroupsList", function () {
      Config.useFixtures = true;
      GroupsStore.fetchGroups();
      let groups = GroupsStore.getGroups();
      expect(groups instanceof GroupsList).toBeTruthy();
    });

    it("should return all of the groups it was given", function () {
      Config.useFixtures = true;
      GroupsStore.fetchGroups();
      let groups = GroupsStore.getGroups().getItems();
      expect(groups.length).toEqual(this.groupsFixture.length);
    });

  });
});
