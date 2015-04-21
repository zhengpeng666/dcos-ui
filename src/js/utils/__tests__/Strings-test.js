jest.dontMock("../Strings");

var Strings = require("../Strings");

describe("Strings", function () {

  describe("#ipToHostAddress", function () {

    it("converts ip string to hostaddress", function () {
      var hostname = Strings.ipToHostAddress("ip-12-12-12-12");
      expect(hostname).toEqual("12.12.12.12");
    });

    it("does not convert ip string to hostaddress", function () {
      var hostname = Strings.ipToHostAddress("12-12-12-12");
      expect(hostname).toEqual("12-12-12-12");
    });

  });

  describe("#escapeForRegExp", function () {

    it("escapes string", function () {
      var _return = Strings.escapeForRegExp("-[]/{}()*+?.\\^$|");
      var escaped = "\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|";
      expect(_return).toEqual(escaped);
    });

  });

});
