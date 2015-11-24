let fixturePath = "../../../../tests/_fixtures/acl/group-with-details.json";

jest.dontMock("underscore");
jest.dontMock("../Group");
jest.dontMock("../Item");
jest.dontMock("../List");
jest.dontMock("../User");
jest.dontMock("../UsersList");
jest.dontMock("../../utils/Util");
jest.dontMock(fixturePath);

let _ = require("underscore");
let Group = require("../Group");
let groupFixture = require(fixturePath);
let UsersList = require("../UsersList");

describe("Group", function () {

  beforeEach(function () {
    this.groupFixture = _.clone(groupFixture);
    this.instance = new Group(groupFixture);
  });

  describe("#getPermissions", function () {

    it("returns the permissions it was given", function () {
      expect(this.instance.getPermissions())
        .toEqual(this.groupFixture.permissions);
    });

  });

  describe("#getUsers", function () {

    it("returns an instance of UsersList", function () {
      let users = this.instance.getUsers();
      expect(users instanceof UsersList).toBeTruthy();
    });

    it("returns a UsersList with the number of items we provided",
      function () {
      let users = this.instance.getUsers().getItems();
      expect(users.length)
        .toEqual(this.groupFixture.users.length);
    });

    it("returns a UsersList with the data we provided", function () {
      let users = this.instance.getUsers().getItems();
      expect(users[0].get("uid"))
        .toEqual(this.groupFixture.users[0].user.uid);
      expect(users[1].get("uid"))
        .toEqual(this.groupFixture.users[1].user.uid);
    });

  });

});
