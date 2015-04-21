/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Humanize = require("humanize");

var Chart = require("./Chart");
var TimeSeriesChart = require("./TimeSeriesChart");

var ResourceChart = React.createClass({

  displayName: "ResourceChart",

  propTypes: {
    colorIndex: React.PropTypes.number.isRequired,
    allocResources: React.PropTypes.object.isRequired,
    totalResources: React.PropTypes.object.isRequired,
    mode: React.PropTypes.string,
    refreshRate: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      colorIndex: 0
    };
  },

  getData: function () {
    var props = this.props;
    return [{
        name: "Alloc",
        colorIndex: this.props.colorIndex,
        values: props.allocResources[props.mode]
      }];
  },

  getLatestPercent: function (values) {
    return _.last(values).percentage;
  },

  getHeadline: function (values, totalValues) {
    var value = _.last(values).value;
    var totalValue = _.last(totalValues).value;
    if (this.props.mode === "cpus") {
      return value + " of " + totalValue + " Shares";
    } else {
      return Humanize.filesize(value * 1024 * 1024, 1024, 0) + " of " +
        Humanize.filesize(totalValue * 1024 * 1024, 1024, 0);
    }
  },

  getChart: function () {
    var props = this.props;

    return (
      <Chart calcHeight={function (w) { return w / 2; }}>
        <TimeSeriesChart
          data={this.getData()}
          maxY={this.getLatestPercent(props.totalResources[props.mode])}
          y="percentage"
          refreshRate={props.refreshRate} />
      </Chart>
    );
  },

  render: function () {
    var props = this.props;
    var allocResources = props.allocResources[props.mode];
    var totalResources = props.totalResources[props.mode];

    return (
      <div className="chart">
        <div className="text-align-center">
          <p className="h1-jumbo unit">
            {this.getLatestPercent(allocResources)}
            <sup>%</sup>
          </p>
          <p className={"h4 unit-label path-color-" + this.props.colorIndex}>
            {this.getHeadline(allocResources, totalResources)}
          </p>
        </div>
        {this.getChart()}
      </div>
    );
  }
});

module.exports = ResourceChart;
