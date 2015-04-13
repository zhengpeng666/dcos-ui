/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("../TaskFailureTimeSeriesChart");
var TaskFailureTimeSeriesChart = require("../TaskFailureTimeSeriesChart");

describe("TaskFailureTimeSeriesChart", function () {

  beforeEach(function () {
    var data = [];
    var now = (new Date()).getTime();

    for (var i = 0; i <= 31; i++) {
      data.push({
        date: now + (2000 * i),
        rate: _.random(0, 100)
      });
    }

    this.data = data;
  });

  it("should display the last failure rate", function () {
    var chart = TestUtils.renderIntoDocument(
      <TaskFailureTimeSeriesChart data={this.data} />
    );

    // Verify that percentage is set correctly
    var title = TestUtils.findRenderedDOMComponentWithClass(
      chart, "unit"
    );
    var percentage = _.last(this.data).rate + "%";
    expect(title.getDOMNode().textContent).toEqual(percentage);
  });

  it("should describe the last failure rate", function () {
    var chart = TestUtils.renderIntoDocument(
      <TaskFailureTimeSeriesChart data={this.data} />
    );

    // Verify that percentage is set correctly
    var label = TestUtils.findRenderedDOMComponentWithClass(
      chart, "unit-label"
    );
    expect(label.getDOMNode().textContent.length).not.toBe(0);
  });
});
