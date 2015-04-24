/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var TimeSeriesChart = require("./TimeSeriesChart");
var TimeSeriesLabel = require("./TimeSeriesLabel");
var ValueTypes = require("../../constants/ValueTypes");

var HostTimeSeriesChart = React.createClass({

  displayName: "HostTimeSeriesChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    refreshRate: React.PropTypes.number.isRequired,
    roundUpValue: React.PropTypes.number,
    minMaxY: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      roundUpValue: 5,
      minMaxY: 10
    };
  },

  getMaxY: function () {
    var props = this.props;
    var roundUpValue = props.roundUpValue;

    var maxSlavesCount = _.max(props.data, function (slave) {
      return slave.slavesCount;
    }).slavesCount;

    var maxY = maxSlavesCount +
      (roundUpValue - (maxSlavesCount % roundUpValue));

    if (maxY < props.minMaxY) {
      maxY = props.minMaxY;
    }

    return maxY;
  },

  getData: function (props) {
    return [{
        name: "Nodes",
        colorIndex: 4,
        values: props.data
      }];
  },

  getLatest: function (data) {
    return _.last(data).slavesCount;
  },

  getChart: function (props) {
    return (
      <Chart calcHeight={function (w) { return w / 2; }}>
        <TimeSeriesChart
          data={this.getData(props)}
          maxY={this.getMaxY()}
          y="slavesCount"
          yFormat={ValueTypes.ABSOLUTE}
          refreshRate={props.refreshRate} />
      </Chart>
    );
  },

  render: function () {
    var props = this.props;

    return (
      <div className="chart">
        <TimeSeriesLabel colorIndex={4}
          y="slavesCount"
          currentValue={this.getLatest(props.data)}
          subHeading={"Connected Nodes"} />
        {this.getChart(props)}
      </div>
    );
  }
});

module.exports = HostTimeSeriesChart;
