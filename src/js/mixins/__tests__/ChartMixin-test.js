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
        right: 0
      },
      refreshRate: interval,
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

});
