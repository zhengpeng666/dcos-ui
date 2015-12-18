jest.dontMock("../ACLAuthStore");
jest.dontMock("../../config/Config");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../events/ACLAuthActions");
jest.dontMock("../../constants/ACLUserRoles");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");

var cookie = require("cookie");

var ACLAuthStore = require("../ACLAuthStore");
var EventTypes = require("../../constants/EventTypes");
var RequestUtil = require("../../utils/RequestUtil");
const USER_COOKIE_KEY = "dcos-acs-info-cookie";

global.atob = global.atob || function () {
  return JSON.stringify({uid: "joe", description: "Joe Doe"});
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
    beforeEach(function () {
      cookie.parse = function () {
        var cookieObj = {};
        // {uid: "joe", description: "Joe Doe"}
        cookieObj[USER_COOKIE_KEY] =
          "eyJ1aWQiOiJqb2UiLCJkZXNjcmlwdGlvbiI6IkpvZSBEb2UifQ==";
        return cookieObj;
      };

      ACLAuthStore.fetchRole = jasmine.createSpy();
    });

    afterEach(function () {
      ACLAuthStore.set({role: undefined});
    });

    it("should get the user", function () {
      expect(ACLAuthStore.getUser())
        .toEqual({uid: "joe", description: "Joe Doe"});
    });

    it("should make a request to fetch role", function () {
      ACLAuthStore.getUser();

      expect(ACLAuthStore.fetchRole).toHaveBeenCalledWith("joe");
    });

    it("should not request to fetch role after success", function () {
      ACLAuthStore.getUser();
      ACLAuthStore.makeAdmin();
      ACLAuthStore.getUser();
      ACLAuthStore.getUser();
      ACLAuthStore.getUser();

      expect(ACLAuthStore.fetchRole.callCount).toEqual(1);
    });

    it("should not request to fetch role after error", function () {
      ACLAuthStore.getUser();
      ACLAuthStore.resetRole();
      ACLAuthStore.getUser();
      ACLAuthStore.getUser();
      ACLAuthStore.getUser();

      expect(ACLAuthStore.fetchRole.callCount).toEqual(1);
    });

  });

  describe("#isAdmin", function () {

    afterEach(function () {
      ACLAuthStore.set({role: undefined});
    });

    it("should return false before processing role", function () {
      expect(ACLAuthStore.isAdmin()).toEqual(false);
    });

    it("should return true after success", function () {
      ACLAuthStore.makeAdmin();

      expect(ACLAuthStore.isAdmin()).toEqual(true);
    });

    it("should return false after error", function () {
      ACLAuthStore.resetRole();

      expect(ACLAuthStore.isAdmin()).toEqual(false);
    });

  });

});
