jest.dontMock("../TabsMixin");
jest.dontMock("../../utils/TabsUtil");

var _ = require("underscore");
var React = require("react/addons");
var Link = require("react-router").Link;

var TestUtils = React.addons.TestUtils;

var TabsMixin = require("../TabsMixin");
var TabsUtil = require("../../utils/TabsUtil");

describe("TabsMixin", function () {
  beforeEach(function () {
    TabsMixin.tabs_tabs = {foo: "bar", baz: "qux", corge: "Grault"};
  });

  describe("#tabs_getRoutedItem", function () {
    beforeEach(function () {
      this.instance = TabsMixin.tabs_getRoutedItem("foo", "baz", true);
    });

    it("should return an element", function () {
      expect(TestUtils.isElement(this.instance)).toEqual(true);
    });

    it("should return an element containing a link", function () {
      expect(TestUtils.isElementOfType(this.instance, Link))
        .toEqual(true);
    });

    it("should add custom class to link", function () {
      expect(this.instance.props.className)
        .toEqual("foo");
    });
  });

  describe("#tabs_getUnroutedItem", function () {
    beforeEach(function () {
      this.instance = TabsMixin.tabs_getUnroutedItem("hux", "baz", true);
    });

    it("should return an element", function () {
      expect(TestUtils.isElement(this.instance)).toEqual(true);
    });

    it("should return an element containing a span", function () {
      expect(this.instance.type).toEqual("span");
    });

    it("should add custom class to span", function () {
      expect(this.instance.props.className)
        .toEqual("hux");
    });
  });

  describe("#tabs_getUnroutedTabs", function () {
    beforeEach(function () {
      TabsMixin.state = {currentTab: "baz"};
    });

    it("should call getTabs with appropriate arguments", function () {
      spyOn(TabsUtil, "getTabs");
      TabsMixin.tabs_getUnroutedTabs(null);

      expect(TabsUtil.getTabs).toHaveBeenCalledWith(
        {foo: "bar", baz: "qux", corge: "Grault"},
        "baz",
        _.noop
      );
    });

    it("should call tabs_getUnroutedItem with appropriate arguments", function () {
      spyOn(TabsMixin, "tabs_getUnroutedItem");
      TabsMixin.tabs_getUnroutedTabs("quix");

      expect(TabsMixin.tabs_getUnroutedItem.argsForCall).toEqual([
        ["quix", "foo", 0],
        ["quix", "baz", 1],
        ["quix", "corge", 2]
      ]);
    });
  });

  describe("#tabs_getRoutedTabs", function () {
    beforeEach(function () {
      TabsMixin.state = {currentTab: "foo"};
    });

    it("should call getTabs with appropriate arguments", function () {
      spyOn(TabsUtil, "getTabs");
      TabsMixin.tabs_getRoutedTabs(null);

      expect(TabsUtil.getTabs).toHaveBeenCalledWith(
        {foo: "bar", baz: "qux", corge: "Grault"},
        "foo",
        _.noop
      );
    });

    it("should call tabs_getRoutedItem with appropriate arguments", function () {
      spyOn(TabsMixin, "tabs_getRoutedItem");
      TabsMixin.tabs_getRoutedTabs("quilt");

      expect(TabsMixin.tabs_getRoutedItem.argsForCall).toEqual([
        ["quilt", "foo", 0],
        ["quilt", "baz", 1],
        ["quilt", "corge", 2]
      ]);
    });
  });

  describe("#tabs_getTabView", function () {
    beforeEach(function () {
      TabsMixin.state = {currentTab: "corge"};
      TabsMixin.renderGraultTabView = function () {
        return "test";
      };
    });

    it("should not call render function before called", function () {
      spyOn(TabsMixin, "renderGraultTabView");
      expect(TabsMixin.renderGraultTabView).not.toHaveBeenCalled();
    });

    it("should call appropriate render function when called", function () {
      spyOn(TabsMixin, "renderGraultTabView");
      TabsMixin.tabs_getTabView();
      expect(TabsMixin.renderGraultTabView).toHaveBeenCalled();
    });

    it("should return result of function when called", function () {
      var result = TabsMixin.tabs_getTabView();
      expect(result).toEqual("test");
    });

    it("should null if it doesn't exist", function () {
      TabsMixin.renderGraultTabView = undefined;
      var result = TabsMixin.tabs_getTabView();
      expect(result).toEqual(null);
    });

    it("should not call render function if it doesn't exist", function () {
      TabsMixin.renderGraultTabView = undefined;
      var fn = TabsMixin.tabs_getTabView.bind(TabsMixin);
      expect(fn).not.toThrow();
    });
  });

});
