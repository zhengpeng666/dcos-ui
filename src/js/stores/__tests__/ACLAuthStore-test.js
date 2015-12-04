jest.dontMock("../ACLAuthStore");
jest.dontMock("../../config/Config");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../events/ACLAuthActions");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");

var cookie = require("cookie");

var ACLAuthStore = require("../ACLAuthStore");
var EventTypes = require("../../constants/EventTypes");
var RequestUtil = require("../../utils/RequestUtil");
const USER_COOKIE_KEY = "ACLMetadata";

global.atob = global.atob || function () {
  return JSON.stringify({description: "John Doe"});
};

describe("ACLAuthStore", function () {

  beforeEach(function () {
    this.cookieParse = cookie.parse;
  });

  afterEach(function () {
    cookie.parse = this.cookieParse;
  });

  describe("#isLoggedIn", function () {
    it("returns false if there is no cookie set", function () {
      cookie.parse = function () {
        var cookieObj = {};
        cookieObj[USER_COOKIE_KEY] = "";
        return cookieObj;
      };
      expect(ACLAuthStore.isLoggedIn()).toEqual(false);
    });

    it("returns true if there is a cookie set", function () {
      cookie.parse = function () {
        var cookieObj = {};
        cookieObj[USER_COOKIE_KEY] = "aRandomCode";
        return cookieObj;
      };
      expect(ACLAuthStore.isLoggedIn()).toEqual(true);
    });
  });

  describe("#logout", function () {
    beforeEach(function () {
      this.document = global.document;
      cookie.serialize = jasmine.createSpy();
      global.document = {cookie: ""};
      ACLAuthStore.emit = jasmine.createSpy();
      ACLAuthStore.logout();
    });

    afterEach(function () {
      global.document = this.document;
    });

    it("should set the cookie to an empty string", function () {
      var args = cookie.serialize.mostRecentCall.args;

      expect(args[0]).toEqual(USER_COOKIE_KEY);
      expect(args[1]).toEqual("");
    });

    it("should emit a logout event", function () {
      var args = ACLAuthStore.emit.mostRecentCall.args;

      expect(args[0]).toEqual(EventTypes.ACL_AUTH_USER_LOGOUT);
    });
  });

  describe("#login", function () {
    it("should make a request to login", function () {
      RequestUtil.json = jasmine.createSpy();
      ACLAuthStore.login({});

      expect(RequestUtil.json).toHaveBeenCalled();
    });
  });

  describe("#getUser", function () {
    cookie.parse = function () {
      var cookieObj = {};
      // {description: "John Doe"}
      cookieObj[USER_COOKIE_KEY] = "eyJkZXNjcmlwdGlvbiI6IkpvaG4gRG9lIn0=";
      return cookieObj;
    };

    expect(ACLAuthStore.getUser()).toEqual({description: "John Doe"});
  });
});
