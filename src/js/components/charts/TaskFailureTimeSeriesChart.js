/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var TimeSeriesChart = require("./TimeSeriesChart");
var TimeSeriesLabel = require("./TimeSeriesLabel");

var TaskFailureTimeSeriesChart = React.createClass({

  displayName: "TaskFailureTimeSeriesChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    refreshRate: React.PropTypes.number.isRequired
  },

  getData: function (props) {
    return [{
        name: "Failure",
        colorIndex: 2,
        values: props.data
      }];
  },

  getLatestPercent: function (data) {
    return _.last(data).rate;
  },

  getChart: function (props) {
    return (
      <Chart>
        <TimeSeriesChart
          data={this.getData(props)}
          maxY={100}
          y="rate"
          refreshRate={props.refreshRate} />
      </Chart>
    );
  },

  render: function () {
    var props = this.props;

    return (
      <div className="chart">
        <TimeSeriesLabel colorIndex={2}
          currentValue={this.getLatestPercent(props.data)}
          subHeading="Current Failure Rate" />
        {this.getChart(props)}
      </div>
    );
  }
});

module.exports = TaskFailureTimeSeriesChart;
