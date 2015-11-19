jest.dontMock("../index");
jest.dontMock("../BannerPlugin");

var BannerPlugin = require("../BannerPlugin");

describe("BannerPlugin", function () {

  describe("#isEnabled", function () {

    it("should return true if headerTitle is defined", function () {
      BannerPlugin.configuration = {headerTitle: "foo"};

      expect(BannerPlugin.isEnabled()).toEqual(true);
    });

    it("should return true if headerContent is defined", function () {
      BannerPlugin.configuration = {headerContent: "foo"};

      expect(BannerPlugin.isEnabled()).toEqual(true);
    });

    it("should return true if footerContent is defined", function () {
      BannerPlugin.configuration = {footerContent: "foo"};

      expect(BannerPlugin.isEnabled()).toEqual(true);
    });

    it("should return false if no content is defined", function () {
      // None of these are defined: headerTitle, headerContent or footerContent
      BannerPlugin.configuration = {foo: "bar"};

      expect(BannerPlugin.isEnabled()).toEqual(false);
    });

    it("should return false if fields are initialized to null", function () {
      BannerPlugin.configuration = {
        headerTitle: null,
        headerContent: null,
        footerContent: null
      };

      expect(BannerPlugin.isEnabled()).toEqual(false);
    });

    it("should return true with mixed intialization", function () {
      BannerPlugin.configuration = {
        headerTitle: null,
        headerContent: undefined,
        footerContent: "foo",
        imagePath: false
      };

      expect(BannerPlugin.isEnabled()).toEqual(true);
    });

  });

});
