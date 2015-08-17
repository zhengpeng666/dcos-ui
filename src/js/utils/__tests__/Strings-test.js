jest.dontMock("../StringUtil");

var StringUtil = require("../StringUtil");

describe("StringUtil", function () {

  describe("#escapeForRegExp", function () {

    it("escapes string", function () {
      var _return = StringUtil.escapeForRegExp("-[]/{}()*+?.\\^$|");
      var escaped = "\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|";
      expect(_return).toEqual(escaped);
    });

  });

  describe("#pluralize", function () {

    it("adds an 's' if there is more than one", function () {
      var items = [1, 2, 3];
      var pluralized = StringUtil.pluralize("item", items);

      expect(pluralized).toEqual("items");
    });

    it("adds an 's' if there are no items", function () {
      var items = [];
      var pluralized = StringUtil.pluralize("item", items);

      expect(pluralized).toEqual("items");
    })

    it("does not add an 's' if there is a single item", function () {
      var item = [1];
      var pluralized = StringUtil.pluralize("item", item);

      expect(pluralized).toEqual("item");
    });

    it("replaces 'y' with 'ie' if the word ends with a 'y'", function () {
      var butterfly = ["many", "butterflies"];
      var pluralized = StringUtil.pluralize("butterfly", butterfly);

      expect(pluralized).toEqual("butterflies");
    });
  });
});
