jest.dontMock("../TooltipMixin");

var _ = require("underscore");
var TooltipMixin = require("../TooltipMixin");
var Tooltip = require("../../vendor/tooltip");

Tooltip = function () {
  var tip = new Tooltip();
  tip.attach = jasmine.spy();
  tip.content = jasmine.spy();
  tip.show = jasmine.spy();
  return tip;
};

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

});
