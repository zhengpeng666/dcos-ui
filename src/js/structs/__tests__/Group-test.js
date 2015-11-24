jest.dontMock("../Group");
jest.dontMock("../Item");
jest.dontMock("../List");
jest.dontMock("../User");
jest.dontMock("../UsersList");
jest.dontMock("../../utils/Util");

let Group = require("../Group");
let UsersList = require("../UsersList");

describe("Group", function () {

  beforeEach(function () {
    this.instance = new Group({
      "gid": "nerds",
      "url": "/groups/nerds",
      "description": "These are the nerds, not the geeks.",
      "permissions": [
        {
          "rid": "service.marathon",
          "description": "Marathon",
          "aclurl": "/acls/service.marathon",
          "actions": [
            {
              "name": "access",
              "url": "/acls/service.marathon/groups/nerds/access"
            }
          ]
        }
      ],
      "users": [
        {
          "membershipurl": "/groups/nerds/users/john",
          "user": {
            "uid": "john",
            "url": "/users/john",
            "description": "John Doe"
          }
        }, {
          "membershipurl": "/groups/nerds/users/john",
          "user": {
            "uid": "john",
            "url": "/users/john",
            "description": "John Doe"
          }
        }
      ]
    });
  });

  describe("#getPermissions", function () {

    it("returns the permissions it was given", function () {
      expect(this.instance.getPermissions()).toEqual([
        {
          "rid": "service.marathon",
          "description": "Marathon",
          "aclurl": "/acls/service.marathon",
          "actions": [
            {
              "name": "access",
              "url": "/acls/service.marathon/groups/nerds/access"
            }
          ]
        }
      ]);
    });

  });

  describe("#getUsers", function () {

    it("returns an instance of UsersList", function () {
      let users = this.instance.getUsers();
      expect(users instanceof UsersList).toBeTruthy();
    });

  });

});
