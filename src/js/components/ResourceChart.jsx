/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Humanize = require("humanize");

var TimeSeriesChart = require("./TimeSeriesChart");

var getPercentage = function (value, decimalPlaces) {
  var percentage = "-";
  if (!_.isNaN(value * 1)) {
    var factor = Math.pow(10, decimalPlaces);
    percentage = Math.round(value * 100 * factor) / factor;
  }
  return percentage;
};

var ResourceChart = React.createClass({

  displayName: "ResourceChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    divide: React.PropTypes.bool.isRequired,
    totalResources: React.PropTypes.object.isRequired,
    usedResources: React.PropTypes.object.isRequired,
    mode: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      width: null
    };
  },

  componentDidMount: function () {
    this.updateWidth();
    window.addEventListener("focus", this.updateWidth);
    window.addEventListener("resize", this.updateWidth);
  },

  componentWillUnmount: function () {
    window.removeEventListener("focus", this.updateWidth);
    window.removeEventListener("resize", this.updateWidth);
  },

  updateWidth: function () {
    this.setState({
      width: this.getDOMNode().offsetWidth
    });
  },

  getFrameworksData: function () {
    var props = this.props;
    return _.map(props.data, function (framework) {
      return {
        name: framework.name,
        colorIndex: framework.colorIndex,
        values: framework.resources[props.mode]
      };
    });
  },

  getAllData: function () {
    var props = this.props;
    return [{
      name: "All",
      colorIndex: 0,
      values: props.usedResources[props.mode],
    }];
  },

  getData: function () {
    if (this.props.divide) {
      return this.getFrameworksData();
    } else {
      return this.getAllData();
    }
  },

  getMaxY: function () {
    var props = this.props;
    return _.last(props.totalResources[props.mode]).y;
  },

  getUsed: function () {
    var props = this.props;

    return _.last(props.usedResources[props.mode]).y;
  },

  getTotalHeadline: function () {
    var max = this.getMaxY();
    var str = "Total: ";
    if (this.props.mode === "cpus") {
      str += max + " CPU";
    } else {
      str += Humanize.filesize(max * 1024 * 1024);
    }
    return str;
  },

  getUsedHeadline: function () {
    var used = this.getUsed();
    var str = "Used: " + getPercentage(used / this.getMaxY(), 2) + "% (";
    if (this.props.mode === "cpus") {
      str += used + " CPU)";
    } else {
      str += Humanize.filesize(used * 1024 * 1024) + ")";
    }
    return str;
  },

  getChart: function () {
    var width = this.state.width;

    if (width != null) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <TimeSeriesChart
          width={width}
          data={this.getData()}
          maxY={this.getMaxY()} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }
    return null;
  },

  render: function () {

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div>
        <h4>{this.getUsedHeadline()}</h4>
        <h5>{this.getTotalHeadline()}</h5>
        {this.getChart()}
      </div>
    );
  }
});

module.exports = ResourceChart;
