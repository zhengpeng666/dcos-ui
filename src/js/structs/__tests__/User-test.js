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

  describe("#getPermissions", function () {

    it("returns the permissions it was given", function () {
      expect(this.instance.getPermissions())
        .toEqual(this.userFixture.permissions);
    });

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

});
