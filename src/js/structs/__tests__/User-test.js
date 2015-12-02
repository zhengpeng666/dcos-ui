let fixturePath = "../../../../tests/_fixtures/acl/user-with-details.json";

jest.dontMock("underscore");
jest.dontMock("../Group");
jest.dontMock("../GroupsList");
jest.dontMock("../Item");
jest.dontMock("../List");
jest.dontMock("../User");
jest.dontMock("../UsersList");
jest.dontMock("../../utils/Util");
jest.dontMock(fixturePath);

let _ = require("underscore");
let GroupsList = require("../GroupsList");
let User = require("../User");
let userFixture = require(fixturePath);

describe("User", function () {

  beforeEach(function () {
    this.userFixture = _.clone(userFixture);
    this.instance = new User(userFixture);
  });

  describe("#getGroups", function () {

    it("returns an instance of GroupsList", function () {
      let groups = this.instance.getGroups();
      expect(groups instanceof GroupsList).toBeTruthy();
    });

    it("returns a GroupsList with the number of items we provided",
      function () {
      let groups = this.instance.getGroups().getItems();
      expect(groups.length)
        .toEqual(this.userFixture.groups.length);
    });

    it("returns a GroupsList with the data we provided", function () {
      let groups = this.instance.getGroups().getItems();
      expect(groups[0].get("gid"))
        .toEqual(this.userFixture.groups[0].group.gid);
      expect(groups[1].get("gid"))
        .toEqual(this.userFixture.groups[1].group.gid);
    });

  });

  describe("#getGroupCount", function () {

    it("returns the number of groups", function () {
      expect(this.instance.getGroupCount())
        .toEqual(this.userFixture.groups.length);
    });

  });

  describe("#getPermissions", function () {

    it("returns the permissions it was given", function () {
      expect(this.instance.getPermissions())
        .toEqual(this.userFixture.permissions);
    });

  });

  describe("#getPermissionCount", function () {

    it("returns the number of groups", function () {
      expect(this.instance.getPermissionCount()).toEqual(1);
    });

  });

  describe("#uniquePermissions", function () {

    it("returns an array of services user has permission to", function () {
      let permissionList = this.instance.uniquePermissions();
      expect(permissionList.length).toEqual(1);
      expect(permissionList[0].rid).toEqual("service.marathon");
    });

  });

});
