jest.dontMock("../Strings");

var Strings = require("../Strings");

describe("Strings", function () {

  describe("#escapeForRegExp", function () {

    it("escapes string", function () {
      var _return = Strings.escapeForRegExp("-[]/{}()*+?.\\^$|");
      var escaped = "\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|";
      expect(_return).toEqual(escaped);
    });

  });

});
