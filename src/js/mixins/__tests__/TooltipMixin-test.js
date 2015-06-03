jest.dontMock("../TooltipMixin");

var _ = require("underscore");
var TooltipMixin = require("../TooltipMixin");
var Tooltip = require("../../vendor/tooltip");

describe("TooltipMixin", function () {

  describe("#componentDidMount", function () {

    beforeEach(function () {
      var node = document.createElement("div");
      this.instance = _.extend({
        getDOMNode: function () {
          return node;
        }
      }, TooltipMixin);
    });

    it("should call #tip_attachTips", function () {
      this.instance.tip_attachTips = jasmine.createSpy();
      this.instance.componentDidMount();
      expect(this.instance.tip_attachTips).toHaveBeenCalled();
    });

    it("should attach listen on mousemove", function () {
      var node = this.instance.getDOMNode();
      node.addEventListener = jasmine.createSpy();
      this.instance.componentDidMount();

      var addEventListener = node.addEventListener;
      expect(addEventListener.calls.length).toEqual(1);
      expect(addEventListener.calls[0].args[0]).toEqual("mousemove");
      expect(typeof addEventListener.calls[0].args[1]).toEqual("function");
    });

  });

  describe("#componentDidUpdate", function () {

    beforeEach(function () {
      this.instance = _.extend({}, TooltipMixin);
    });

    it("should should call #tip_attachTips", function () {
      this.instance.tip_attachTips = jasmine.createSpy();
      this.instance.componentDidUpdate();
      expect(this.instance.tip_attachTips).toHaveBeenCalled();
    });

  });

  describe("#componentWillUnmount", function () {

    beforeEach(function () {
      this.instance = _.extend({}, TooltipMixin);
    });

    it("should call #tip_destroyAllTips", function () {
      this.instance.tip_destroyAllTips = jasmine.createSpy();
      this.instance.componentWillUnmount();
      expect(this.instance.tip_destroyAllTips).toHaveBeenCalled();
    });

  });

  describe("#tip_showCustomTip", function () {

    beforeEach(function () {
      this.instance = _.extend({}, TooltipMixin);
      this.instance.tips = { tip1: new Tooltip() };
      this.el = jasmine.createSpyObj("DOMElement", ["dataset"]);
      spyOn(this.instance, "tip_createTipForElement").andReturn("tip1");
      spyOn(this.instance.tips.tip1, "content").andReturn(this.instance.tips.tip1);
      spyOn(this.instance.tips.tip1, "show").andReturn(this.instance.tips.tip1);
    });

    it("should hide any existing tooltip on the specified target", function () {
      spyOn(this.instance, "tip_hideCustomTip");
      this.instance.tip_showCustomTip({ target: this.el });
      expect(this.instance.tip_hideCustomTip).toHaveBeenCalledWith({ target: this.el });
    });

    it("should create a new tooltip with the specified target", function () {
      this.instance.tip_showCustomTip({ target: this.el });
      expect(this.instance.tip_createTipForElement).toHaveBeenCalledWith(this.el);
    });

    it("should set the specified text in the tooltip", function () {
      this.instance.tip_showCustomTip({ target: this.el, content: "specified text" });
      expect(this.instance.tips.tip1.content).toHaveBeenCalledWith("specified text");
    });

    it("should show the newly created tooltip immediately", function() {
      this.instance.tip_showCustomTip({ target: this.el });
      expect(this.instance.tips.tip1.show).toHaveBeenCalled();
    });

  });

  describe("#tip_hideCustomTip", function () {

    beforeEach(function () {
      this.instance = _.extend({}, TooltipMixin);
      this.el = jasmine.createSpyObj("DOMElement", ["dataset"]);
      this.el.dataset = { id: "tip1" };
      spyOn(this.instance, "tip_destroyTip");
    });

    it("should destroy the tip with the specified ID, if present", function () {
      this.instance.tip_hideCustomTip({ id: "tipID" });
      expect(this.instance.tip_destroyTip).toHaveBeenCalledWith("tipID");
    });

    it("should destroy the tip belonging to the specified target, if ID is not present", function () {
      this.instance.tip_hideCustomTip({ target: this.el });
      expect(this.instance.tip_destroyTip).toHaveBeenCalledWith("tip1");
    });

  });

});
