jest.dontMock("../TooltipMixin");

var _ = require("underscore");
var TooltipMixin = require("../TooltipMixin");

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

  describe("#tip_showTip", function () {

    beforeEach(function () {
      this.instance = _.extend({}, TooltipMixin);
      this.instance.tips = { tip1: {show: jasmine.createSpy(), content: jasmine.createSpy()} };
      this.el = jasmine.createSpyObj("DOMElement", ["dataset"]);
      this.el.dataset.tipID = "tip1";
      this.el.dataset.tipContent = "Default text";
    });

    it("should not show tip before called", function() {
      expect(this.instance.tips.tip1.show).not.toHaveBeenCalled();
    });

    it("should show the newly created tooltip immediately", function() {
      this.instance.tip_showTip(this.el);
      expect(this.instance.tips.tip1.show).toHaveBeenCalled();
    });

    it("should have the default text when show is called", function () {
      this.instance.tip_showTip(this.el);
      expect(this.instance.tips.tip1.content).toHaveBeenCalledWith("Default text");
    });

  });

  describe("#tip_updateTipContent", function () {

    beforeEach(function () {
      this.instance = _.extend({}, TooltipMixin);
      this.instance.tips = { tip1: {content: jasmine.createSpy()} };
      this.el = jasmine.createSpyObj("DOMElement", ["dataset"]);
      this.el.dataset.tipID = "tip1";
    });

    it("should update the specified text in the tooltip", function () {
      this.instance.tip_updateTipContent(this.el, "specified text");
      expect(this.instance.tips.tip1.content).toHaveBeenCalledWith("specified text");
    });
  });

  describe("#tip_hideTip", function () {

    beforeEach(function () {
      this.instance = _.extend({}, TooltipMixin);
      this.instance.tips = { tip1: {hide: jasmine.createSpy(), content: jasmine.createSpy()} };
      this.el = jasmine.createSpyObj("DOMElement", ["dataset"]);
      this.el.removeEventListener = jasmine.createSpy();
      this.el.dataset.tipID = "tip1";
    });

    it("should not hide tip before called", function() {
      expect(this.instance.tips.tip1.hide).not.toHaveBeenCalled();
    });

    it("should hide the tooltip immediately", function() {
      this.instance.tip_hideTip(this.el);
      expect(this.instance.tips.tip1.hide).toHaveBeenCalled();
    });

  });

});
