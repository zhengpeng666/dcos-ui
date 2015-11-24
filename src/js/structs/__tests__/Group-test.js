jest.dontMock("../Group");
jest.dontMock("../Item");
jest.dontMock("../List");
jest.dontMock("../User");
jest.dontMock("../UsersList");
jest.dontMock("../../utils/Util");

let Group = require("../Group");
let groupFixture = require("./fixtures/groupData");
let UsersList = require("../UsersList");

describe("Group", function () {

  beforeEach(function () {
    this.instance = new Group(groupFixture);
  });

  describe("#getPermissions", function () {

    it("returns the permissions it was given", function () {
      expect(this.instance.getPermissions()).toEqual(groupFixture.permissions);
    });

  });

  describe("#getUsers", function () {

    it("returns an instance of UsersList", function () {
      let users = this.instance.getUsers();
      expect(users instanceof UsersList).toBeTruthy();
    });

    it("returns a UsersList with the number of items we provided",
      function () {
      let users = this.instance.getUsers();
      expect(users.list.length).toEqual(groupFixture.users.length);
    });

    it("returns a UsersList with the data we provided", function () {
      let users = this.instance.getUsers();
      expect(users.list[0].uid).toEqual(groupFixture.users[0].user.uid);
      expect(users.list[1].uid).toEqual(groupFixture.users[1].user.uid);
    });

  });

});
