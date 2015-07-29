var _ = require("underscore");
var React = require("react/addons");
var Units = require("../../utils/Units");

var Chart = require("./Chart");
var TimeSeriesChart = require("./TimeSeriesChart");
var TimeSeriesLabel = require("./TimeSeriesLabel");

var ResourceTimeSeriesChart = React.createClass({

  displayName: "ResourceTimeSeriesChart",

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
      return Units.filesize(value * 1024 * 1024, 0) + " of " +
        Units.filesize(totalValue * 1024 * 1024, 0);
    }
  },

  getChart: function () {
    var props = this.props;

    return (
      <Chart>
        <TimeSeriesChart
          data={this.getData()}
          maxY={100}
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
        <TimeSeriesLabel colorIndex={this.props.colorIndex}
          currentValue={this.getLatestPercent(allocResources)}
          subHeading={this.getHeadline(allocResources, totalResources)} />
        {this.getChart()}
        <div className="timeseries-selector" />
      </div>
    );
  }
});

module.exports = ResourceTimeSeriesChart;
