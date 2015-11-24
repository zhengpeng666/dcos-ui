jest.dontMock("../Group");
jest.dontMock("../GroupsList");
jest.dontMock("../Item");
jest.dontMock("../List");
jest.dontMock("../User");
jest.dontMock("../UsersList");
jest.dontMock("../../utils/Util");

let GroupsList = require("../GroupsList");
let User = require("../User");
let userFixture = require("./fixtures/userData");

describe("User", function () {

  beforeEach(function () {
    this.instance = new User(userFixture);
  });

  describe("#getPermissions", function () {

    it("returns the permissions it was given", function () {
      expect(this.instance.getPermissions()).toEqual(userFixture.permissions);
    });

  });

  describe("#getGroups", function () {

    it("returns an instance of GroupsList", function () {
      let groups = this.instance.getGroups();
      expect(groups instanceof GroupsList).toBeTruthy();
    });

    it("returns a GroupsList with the number of items we provided",
      function () {
      let groups = this.instance.getGroups();
      expect(groups.list.length).toEqual(userFixture.groups.length);
    });

    it("returns a GroupsList with the data we provided", function () {
      let groups = this.instance.getGroups();
      expect(groups.list[0].gid).toEqual(userFixture.groups[0].group.gid);
      expect(groups.list[1].gid).toEqual(userFixture.groups[1].group.gid);
    });

  });

});
