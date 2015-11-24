jest.dontMock("../Group");
jest.dontMock("../GroupsList");
jest.dontMock("../Item");
jest.dontMock("../List");
jest.dontMock("../User");
jest.dontMock("../UsersList");
jest.dontMock("../../utils/Util");

let GroupsList = require("../GroupsList");
let User = require("../User");

describe("User", function () {

  beforeEach(function () {
    this.instance = new User({
      "uid": "john",
      "url": "/users/john",
      "description": "John Doe",
      "permissions": {
        "direct": [
          {
            "rid": "service.marathon",
            "description": "Marathon",
            "aclurl": "/acls/service.marathon",
            "actions": [
              {
                "name": "access",
                "url": "/acls/service.marathon/users/john/access"
              }
            ]
          }
        ],
        "groups": [
          {
            "rid": "service.marathon",
            "description": "Marathon",
            "aclurl": "/acls/service.marathon",
            "gid": "nerds",
            "membershipurl": "/groups/nerds/users/john",
            "actions": [
              {
                "name": "access",
                "url": "/acls/service.marathon/groups/nerds/access"
              }
            ]
          }
        ]
      }
    });
  });

  describe("#getPermissions", function () {

    it("returns the permissions it was given", function () {
      expect(this.instance.getPermissions()).toEqual({
        "direct": [
          {
            "rid": "service.marathon",
            "description": "Marathon",
            "aclurl": "/acls/service.marathon",
            "actions": [
              {
                "name": "access",
                "url": "/acls/service.marathon/users/john/access"
              }
            ]
          }
        ],
        "groups": [
          {
            "rid": "service.marathon",
            "description": "Marathon",
            "aclurl": "/acls/service.marathon",
            "gid": "nerds",
            "membershipurl": "/groups/nerds/users/john",
            "actions": [
              {
                "name": "access",
                "url": "/acls/service.marathon/groups/nerds/access"
              }
            ]
          }
        ]
      });
    });

  });

  describe("#getGroups", function () {

    it("returns an instance of GroupsList", function () {
      let groups = this.instance.getGroups();
      expect(groups instanceof GroupsList).toBeTruthy();
    });

  });

});
