jest.dontMock("../Strings");

var Strings = require("../Strings");

describe("Strings", function () {

  describe("#ipToHostName", function () {

    it("converts ip string to hostname", function () {
      var hostname = Strings.ipToHostName("ip-12-12-12-12");
      expect(hostname).toEqual("12.12.12.12");
    });

    it("does not convert ip string to hostname", function () {
      var hostname = Strings.ipToHostName("12-12-12-12");
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
