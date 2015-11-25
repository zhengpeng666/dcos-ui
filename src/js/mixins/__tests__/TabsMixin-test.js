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
    TabsMixin.tabs = {foo: "bar", baz: "qux", corge: "Grault"};
  });

  describe("#tabs_getLink", function () {
    beforeEach(function () {
      this.instance = TabsMixin.tabs_getLink("foo", "baz", true);
    });

    it("should return an element", function () {
      expect(TestUtils.isElement(this.instance)).toEqual(true);
    });

    it("should return an element containing a link", function () {
      expect(TestUtils.isElementOfType(this.instance.props.children, Link))
        .toEqual(true);
    });

    it("should add custom class to link", function () {
      expect(this.instance.props.children.props.className)
        .toEqual("foo");
    });

    it("should return an li with an active class", function () {
      expect(this.instance.props.className).toEqual("active");
    });

    it("should return an li without an active class", function () {
      this.instance = TabsMixin.tabs_getLink(null, "baz", false);
      expect(this.instance.props.className).toEqual("");
    });
  });

  describe("#tabs_getSpan", function () {
    beforeEach(function () {
      this.instance = TabsMixin.tabs_getSpan("hux", "baz", true);
    });

    it("should return an element", function () {
      expect(TestUtils.isElement(this.instance)).toEqual(true);
    });

    it("should return an element containing a span", function () {
      expect(this.instance.props.children.type).toEqual("span");
    });

    it("should add custom class to span", function () {
      expect(this.instance.props.children.props.className)
        .toEqual("hux");
    });

    it("should return an li with an active class", function () {
      expect(this.instance.props.className).toEqual("active");
    });

    it("should return an li without an active class", function () {
      this.instance = TabsMixin.tabs_getSpan(null, "baz", false);
      expect(this.instance.props.className).toEqual("");
    });
  });

  describe("#tabs_getTabs", function () {
    beforeEach(function () {
      TabsMixin.state = {currentTab: "baz"};
    });

    it("should call getTabLinks with appropriate arguments", function () {
      spyOn(TabsUtil, "getTabLinks");
      TabsMixin.tabs_getTabs(null);

      expect(TabsUtil.getTabLinks).toHaveBeenCalledWith(
        {foo: "bar", baz: "qux", corge: "Grault"},
        "baz",
        _.noop
      );
    });

    it("should call tabs_getSpan with appropriate arguments", function () {
      spyOn(TabsMixin, "tabs_getSpan");
      TabsMixin.tabs_getTabs("quix");

      expect(TabsMixin.tabs_getSpan.argsForCall).toEqual([
        ["quix", "foo", false, 0],
        ["quix", "baz", true, 1],
        ["quix", "corge", false, 2]
      ]);
    });
  });

  describe("#tabs_getTabLinks", function () {
    beforeEach(function () {
      TabsMixin.state = {currentTab: "foo"};
    });

    it("should call getTabLinks with appropriate arguments", function () {
      spyOn(TabsUtil, "getTabLinks");
      TabsMixin.tabs_getTabLinks(null);

      expect(TabsUtil.getTabLinks).toHaveBeenCalledWith(
        {foo: "bar", baz: "qux", corge: "Grault"},
        "foo",
        _.noop
      );
    });

    it("should call tabs_getLink with appropriate arguments", function () {
      spyOn(TabsMixin, "tabs_getLink");
      TabsMixin.tabs_getTabLinks("quilt");

      expect(TabsMixin.tabs_getLink.argsForCall).toEqual([
        ["quilt", "foo", true, 0],
        ["quilt", "baz", false, 1],
        ["quilt", "corge", false, 2]
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
