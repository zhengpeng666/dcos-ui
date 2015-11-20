jest.autoMockOff();

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var BannerPlugin = require("../BannerPlugin");

describe("BannerPlugin", function () {

  beforeEach(function () {
    this.BannerPlugin = _.clone(BannerPlugin);
    this.BannerPlugin.configuration = _.clone(BannerPlugin.configuration);
  });

  describe("#initialize", function () {

    beforeEach(function () {
      this.Plugins = {
        addAction: jest.genMockFunction(),
        addFilter: jest.genMockFunction()
      };

      this.BannerPlugin.initialize(this.Plugins);
    });

    it("should add one action and two filters", function () {
      expect(this.Plugins.addAction.mock.calls[0]).toEqual(
        ["applicationDidUpdate", this.BannerPlugin.applicationDidUpdate]
      );
      expect(this.Plugins.addFilter.mock.calls[0]).toEqual(
        ["applicationContents", this.BannerPlugin.applicationContents]
      );
      expect(this.Plugins.addFilter.mock.calls[1]).toEqual(
        ["overlayNewWindowButton", this.BannerPlugin.overlayNewWindowButton]
      );
    });
  });

  describe("#configure", function () {

    it("changes the plugin's configuration", function () {
      expect(this.BannerPlugin.isEnabled()).toBeFalsy();
      this.BannerPlugin.configure({headerTitle: "foo"});
      expect(this.BannerPlugin.isEnabled()).toBeTruthy();
    });

  });

  describe("#isEnabled", function () {

    it("should return true if headerTitle is defined", function () {
      this.BannerPlugin.configure({headerTitle: "foo"});

      expect(this.BannerPlugin.isEnabled()).toEqual(true);
    });

    it("should return true if headerContent is defined", function () {
      this.BannerPlugin.configure({headerContent: "bar"});

      expect(this.BannerPlugin.isEnabled()).toEqual(true);
    });

    it("should return true if footerContent is defined", function () {
      this.BannerPlugin.configure({footerContent: "foo"});

      expect(this.BannerPlugin.isEnabled()).toEqual(true);
    });

    it("should return false if no content is defined", function () {
      // None of these are defined: headerTitle, headerContent or footerContent
      this.BannerPlugin.configure({foo: "bar"});

      expect(this.BannerPlugin.isEnabled()).toEqual(false);
    });

    it("should return false if fields are initialized to null", function () {
      this.BannerPlugin.configure({
        headerTitle: null,
        headerContent: null,
        footerContent: null
      });

      expect(this.BannerPlugin.isEnabled()).toEqual(false);
    });

    it("should return true with mixed intialization", function () {
      this.BannerPlugin.configure({
        headerTitle: null,
        headerContent: undefined,
        footerContent: "foo",
        imagePath: false
      });

      expect(this.BannerPlugin.isEnabled()).toEqual(true);
    });

  });

  describe("#toggleFullContent", function () {

    beforeEach(function () {
      this.BannerPlugin.configure({headerTitle: "foo"});
      spyOn(this.BannerPlugin, "toggleFullContent");
      this.instance = TestUtils.renderIntoDocument(
        this.BannerPlugin.applicationContents()
      );
    });

    it("should not call before click", function () {
      expect(this.BannerPlugin.toggleFullContent).not.toHaveBeenCalled();
    });

    it("should call once with one click", function () {
      var infoIcon = TestUtils.findRenderedDOMComponentWithClass(
        this.instance,
        "banner-plugin-info-icon"
      );

      TestUtils.Simulate.click(infoIcon);
      expect(this.BannerPlugin.toggleFullContent.callCount).toEqual(1);
    });

    it("should call n times with n clicks", function () {
      var infoIcon = TestUtils.findRenderedDOMComponentWithClass(
        this.instance,
        "banner-plugin-info-icon"
      );

      TestUtils.Simulate.click(infoIcon);
      TestUtils.Simulate.click(infoIcon);
      TestUtils.Simulate.click(infoIcon);
      TestUtils.Simulate.click(infoIcon);
      expect(this.BannerPlugin.toggleFullContent.callCount).toEqual(4);
    });

  });

  describe("#applicationDidUpdate", function () {
    beforeEach(function () {
      this.iframe = document.createElement("iframe");
      document.getElementById = jasmine.createSpy("HTML Element")
        .andReturn(this.iframe);
      spyOn(this.iframe.contentWindow, "addEventListener");

    });

    it("should add event listener to iframe when enabled", function () {
      this.BannerPlugin.configure({headerTitle: "foo"});
      this.BannerPlugin.applicationDidUpdate();
      expect(this.iframe.contentWindow.addEventListener).toHaveBeenCalled();
    });

    it("should not add event listener to iframe when not enabled", function () {
      this.BannerPlugin.applicationDidUpdate();
      expect(this.iframe.contentWindow.addEventListener).not.toHaveBeenCalled();
    });
  });

  describe("#applicationContents", function () {

    it("should return content when enabled", function () {
      this.BannerPlugin.configure({headerTitle: "foo"});
      expect(TestUtils.isElement(this.BannerPlugin.applicationContents()))
        .toEqual(true);
    });

    it("should return null when not enabled", function () {
      expect(TestUtils.isElement(this.BannerPlugin.applicationContents()))
        .toEqual(false);
    });

    it("should render an iframe when enabled", function () {
      this.BannerPlugin.configure({headerTitle: "foo"});

      var instance = TestUtils.renderIntoDocument(
        this.BannerPlugin.applicationContents()
      );
      var iframe = TestUtils.findRenderedDOMComponentWithTag(
        instance, "iframe"
      );

      expect(TestUtils.isDOMComponent(iframe)).toEqual(true);
    });

  });

  describe("#overlayNewWindowButton", function () {

    it("should return content when enabled", function () {
      this.BannerPlugin.configure({headerTitle: "foo"});
      expect(this.BannerPlugin.overlayNewWindowButton("foo")).toEqual(null);
    });

    it("should return null when not enabled", function () {
      expect(this.BannerPlugin.overlayNewWindowButton("foo")).toEqual("foo");
    });
  });

  describe("#getColorStyles", function () {

    it("should return default colors when nothing is changed", function () {
      expect(this.BannerPlugin.getColorStyles()).toEqual({
        backgroundColor: "#1E232F",
        color: "#FFFFFF"
      });
    });

    it("should return an object with provided colors", function () {
      this.BannerPlugin.configure({
        backgroundColor: "foo",
        foregroundColor: "bar"
      });

      expect(this.BannerPlugin.getColorStyles()).toEqual({
        backgroundColor: "foo",
        color: "bar"
      });
    });
  });

  describe("#getIcon", function () {

    it("should return null if imagePath is null", function () {
      this.BannerPlugin.configure({
        imagePath: null
      });

      expect(this.BannerPlugin.getIcon()).toEqual(null);
    });

    it("should return null if imagePath is empty string", function () {
      this.BannerPlugin.configure({
        imagePath: ""
      });

      expect(this.BannerPlugin.getIcon()).toEqual(null);
    });

    it("should return an element if imagePath is set", function () {
      this.BannerPlugin.configure({
        imagePath: "foo"
      });

      expect(TestUtils.isElement(this.BannerPlugin.getIcon())).toEqual(true);
    });
  });

  describe("#getTitle", function () {

    it("should return null if headerTitle is null", function () {
      this.BannerPlugin.configure({
        headerTitle: null
      });

      expect(this.BannerPlugin.getTitle()).toEqual(null);
    });

    it("should return null if headerTitle is empty string", function () {
      this.BannerPlugin.configure({
        headerTitle: ""
      });

      expect(this.BannerPlugin.getTitle()).toEqual(null);
    });

    it("should return an element if headerTitle is set", function () {
      this.BannerPlugin.configure({
        headerTitle: "foo"
      });

      expect(TestUtils.isElement(this.BannerPlugin.getTitle())).toEqual(true);
    });
  });

  describe("#getHeaderContent", function () {

    it("should return null if headerContent is null", function () {
      this.BannerPlugin.configure({
        headerContent: null
      });

      expect(this.BannerPlugin.getHeaderContent()).toEqual(null);
    });

    it("should return null if headerContent is empty string", function () {
      this.BannerPlugin.configure({
        headerContent: ""
      });

      expect(this.BannerPlugin.getHeaderContent()).toEqual(null);
    });

    it("should return an element if headerContent is set", function () {
      this.BannerPlugin.configure({
        headerContent: "foo"
      });

      expect(TestUtils.isElement(this.BannerPlugin.getHeaderContent()))
        .toEqual(true);
    });
  });

  describe("#getHeader", function () {

    beforeEach(function () {
      this.BannerPlugin.getIcon = function () { return null; };
      this.BannerPlugin.getTitle = function () { return null; };
      this.BannerPlugin.getHeaderContent = function () { return null; };
    });

    it("should return null if depending functions returns null", function () {
      expect(this.BannerPlugin.getHeader()).toEqual(null);
    });

    it("should return an element if getIcon return something", function () {
      this.BannerPlugin.getIcon = function () { return "foo"; };

      expect(TestUtils.isElement(this.BannerPlugin.getHeader()))
        .toEqual(true);
    });

    it("should return an element if getTitle return something", function () {
      this.BannerPlugin.getTitle = function () { return "foo"; };

      expect(TestUtils.isElement(this.BannerPlugin.getHeader()))
        .toEqual(true);
    });

    it("should return an element if getHeaderContent return something", function () {
      this.BannerPlugin.getHeaderContent = function () { return "foo"; };

      expect(TestUtils.isElement(this.BannerPlugin.getHeader()))
        .toEqual(true);
    });
  });

  describe("#getFooter", function () {

    it("should return null if footerContent is null", function () {
      this.BannerPlugin.configure({
        footerContent: null
      });

      expect(this.BannerPlugin.getFooter()).toEqual(null);
    });

    it("should return null if footerContent is empty string", function () {
      this.BannerPlugin.configure({
        footerContent: ""
      });

      expect(this.BannerPlugin.getFooter()).toEqual(null);
    });

    it("should return an element if footerContent is set", function () {
      this.BannerPlugin.configure({
        footerContent: "foo"
      });

      expect(TestUtils.isElement(this.BannerPlugin.getFooter()))
        .toEqual(true);
    });
  });

});
