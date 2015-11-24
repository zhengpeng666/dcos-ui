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
      "groups": [
        {
          "membershipurl": "/groups/nerds/users/john",
          "group": {
            "gid": "nerds",
            "url": "/groups/nerds",
            "description": "These are the nerds, not the geeks."
          }
        },
        {
          "membershipurl": "/groups/geeks/users/john",
          "group": {
            "gid": "geeks",
            "url": "/groups/geeks",
            "description": "These are the geeks, not the nerds."
          }
        }
      ],
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

    it("returns a GroupsList with the number of items we provided",
      function () {
      let groups = this.instance.getGroups();
      expect(groups.list.length).toEqual(2);
    });

    it("returns a GroupsList with the data we provided", function () {
      let groups = this.instance.getGroups();
      expect(groups.list[0].gid).toEqual("nerds");
      expect(groups.list[1].gid).toEqual("geeks");
    });

  });

});
