jest.dontMock("underscore");
jest.dontMock("../GroupsStore");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../events/ACLGroupActions");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../structs/Group");
jest.dontMock("../../structs/GroupsList");
jest.dontMock("../../structs/Item");
jest.dontMock("../../structs/List");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");
jest.dontMock("../../../../tests/_fixtures/acl/groups-unicode.json");

let _ = require("underscore");
let groupsFixture = require("../../../../tests/_fixtures/acl/groups-unicode.json");
let GroupsList = require("../../structs/GroupsList");
let GroupsStore = require("../GroupsStore");

describe("GroupsStore", function () {

  beforeEach(function () {
    this.groupsFixture = _.clone(groupsFixture);
    GroupsStore.init();
  });

  describe("#getGroups", function () {

    it("should return an instance of GroupsList", function () {
      GroupsStore.fetchGroups();
      let groups = GroupsStore.getGroups();
      expect(groups instanceof GroupsList).toBeTruthy();
    });

    it("should return all of the groups it was given", function () {
      GroupsStore.fetchGroups();
      let groups = GroupsStore.getGroups().getItems();
      expect(groups.length).toEqual(this.groupsFixture.length);
    });

  });
});
