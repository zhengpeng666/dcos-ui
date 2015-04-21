/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var TimeSeriesChart = require("./TimeSeriesChart");

var TaskFailureTimeSeriesChart = React.createClass({

  displayName: "ResourceChart",

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
      <Chart calcHeight={function (w) { return w / 2; }}>
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
        <div className="text-align-center">
          <div className="column-small-12">
            <p className="h1-jumbo unit">
              {this.getLatestPercent(props.data)}
              <sup>%</sup>
            </p>
            <p className="h4 unit-label path-color-2">
              Current Failure Rate
            </p>
          </div>
        </div>
        {this.getChart(props)}
      </div>
    );
  }
});

module.exports = TaskFailureTimeSeriesChart;
