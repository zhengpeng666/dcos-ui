/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("./fixtures/MockTimeSeriesData");
jest.dontMock("../../../mixins/ChartMixin");
jest.dontMock("../TimeSeriesChart");
jest.dontMock("../TimeSeriesArea");

var MockTimeSeriesData = require("./fixtures/MockTimeSeriesData");
var TimeSeriesArea = require("../TimeSeriesArea");

function checkPath(area, props) {
  var index = 1;
  var points = area.split(",");
  _.each(points, function (str, i) {
    // Disgard values after we've been through data
    // Also parseFloat and check with index (int) to make sure we exactly
    // where we want to be
    if (index < props.values.length && parseFloat(str) === index) {

      // Pick out the value we need
      var value = Math.round(parseFloat(points[i + 1].split("S")));
      expect(value).toEqual(props.values[index].y);
      index++;
    }
  });
}

describe("TimeSeriesArea", function () {

  beforeEach(function () {
    this.props = {
      values: MockTimeSeriesData.firstSet
    };

    this.areaDef = d3.svg.area()
      .x(function (d) { return d.date; })
      .y0(function () { return 0; })
      .y1(function (d) { return d.y; })
      .interpolate("monotone");
    this.area = this.areaDef(this.props.values);

    this.valueLineDef = d3.svg.line()
      .x(function (d) { return d.date; })
      .y(function (d) { return d.y; })
      .interpolate("monotone");

    this.valueLine = this.valueLineDef(this.props.values);

    this.instance = TestUtils.renderIntoDocument(
      <svg>
        <TimeSeriesArea
          line={this.valueLine}
          path={this.area}
          position={[-10, 0]}
          transitionTime={10} />
      </svg>
    );
  });

  it("should a path according to first data set", function () {
    checkPath(this.area, this.props);
  });

  it("should a path according to second data set", function () {
    var values = MockTimeSeriesData.secondSet;
    var area = this.areaDef(values);
    var valueLine = this.valueLineDef(values);

    this.instance = TestUtils.renderIntoDocument(
      <svg>
        <TimeSeriesArea
          line={valueLine}
          path={area}
          position={[-10, 0]}
          transitionTime={10} />
      </svg>
    );

    checkPath(this.area, this.props);
  });

  it("should check that path is correctly updated", function () {
    checkPath(this.area, this.props);
    var values = MockTimeSeriesData.secondSet;
    var area = this.areaDef(values);
    var valueLine = this.valueLineDef(values);

    this.instance = TestUtils.renderIntoDocument(
      <svg>
        <TimeSeriesArea
          line={valueLine}
          path={area}
          position={[-10, 0]}
          transitionTime={10} />
      </svg>
    );

    checkPath(this.area, this.props);
  });

});
