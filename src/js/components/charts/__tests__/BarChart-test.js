/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("../BarChart");
jest.dontMock("../../../mixins/InternalStorageMixin");
var BarChart = require("../BarChart");

describe("BarChart", function () {

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

    this.instance = TestUtils.renderIntoDocument(
      <BarChart data={data}
        width={0}
        height={0}
        refreshRate={interval}
        />
    );
  });

  describe("#formatXAxis", function () {

    it("should parse strings to numbers", function () {
      expect(this.instance.formatXAxis("0")).toEqual("0");
    });

    it("should parse numbers", function () {
      expect(this.instance.formatXAxis(3)).toEqual("3s");
    });

    it("should not format zeros", function () {
      expect(this.instance.formatXAxis("0")).toEqual("0");
    });

    it("should format positive numbers", function () {
      expect(this.instance.formatXAxis(3)).toEqual("3s");
    });

    it("should format negative numbers", function () {
      expect(this.instance.formatXAxis(-3)).toEqual("-3s");
    });

  });

  describe("#getXScale", function () {

    it("should build the correct amount of ticks", function () {
      var props = this.instance.props;
      var xScale = this.instance.getXScale(props);

      expect(xScale.ticks(4)).toEqual([-60, -40, -20, 0]);
    });

    it("should have the correct domain range", function () {
      var props = this.instance.props;
      var xScale = this.instance.getXScale(props);

      expect(xScale.domain()).toEqual([-60, 0]);
    });

  });

});
