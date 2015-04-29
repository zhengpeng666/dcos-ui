/** @jsx React.DOM */

var _ = require("underscore");

jest.dontMock("../ChartMixin");
var ChartMixin = require("../ChartMixin");

describe("ChartMixin", function () {

  beforeEach(function () {
    var now = Date.now();
    var interval = 2000;

    var data = [{
        id: "used_resources",
        values: _.map(new Array(31), function (value, i) {
          return {
            date: now + (interval * i),
            percentage: 0,
            value: 0
          };
        })
    }];

    this.props = {
      data: data,
      margin: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      refreshRate: interval,
      height: 0,
      width: 0
    };
  });

  describe("#formatXAxis", function () {

    it("should parse strings to numbers", function () {
      expect(ChartMixin.formatXAxis("0")).toEqual("0");
    });

    it("should parse numbers", function () {
      expect(ChartMixin.formatXAxis(3)).toEqual("3s");
    });

    it("should not format zeros", function () {
      expect(ChartMixin.formatXAxis(0)).toEqual(0);
    });

    it("should format positive numbers", function () {
      expect(ChartMixin.formatXAxis(3)).toEqual("3s");
    });

    it("should format negative numbers", function () {
      expect(ChartMixin.formatXAxis(-3)).toEqual("-3s");
    });

  });

  describe("#getXScale", function () {

    it("should build the correct amount of ticks", function () {
      var xScale = ChartMixin.getXScale(this.props);
      expect(xScale.ticks(4)).toEqual([-60, -40, -20, 0]);
    });

    it("should have the correct domain range", function () {
      var xScale = ChartMixin.getXScale(this.props);
      expect(xScale.domain()).toEqual([-60, 0]);
    });

  });

  describe("#getHeight", function () {

    it("should return 0 given 0 height and 0 margin", function () {
      var height = ChartMixin.getHeight(this.props);
      expect(height).toEqual(0);
    });

    it("yields positive view height given node height > margins", function () {
      var height = ChartMixin.getHeight({
        margin: {
          top: 10,
          bottom: 12
        },
        height: 31
      });

      expect(height).toEqual(9);
    });

    it("yields negative view height given node height < margins", function () {
      var height = ChartMixin.getHeight({
        margin: {
          top: 100,
          bottom: 120
        },
        height: 31
      });

      expect(height).toEqual(-189);
    });

  });

  describe("#getWidth", function () {

    it("should return 0 given 0 width and 0 margin", function () {
      var width = ChartMixin.getWidth(this.props);

      expect(width).toEqual(0);
    });

    it("yields positive view width given node width > margins", function () {
      var width = ChartMixin.getWidth({
        margin: {
          left: 9,
          right: 21
        },
        width: 55
      });

      expect(width).toEqual(25);
    });

    it("yields negative view width given node width < margins", function () {
      var width = ChartMixin.getWidth({
        margin: {
          left: 90,
          right: 210
        },
        width: 55
      });

      expect(width).toEqual(-245);
    });

  });

});
