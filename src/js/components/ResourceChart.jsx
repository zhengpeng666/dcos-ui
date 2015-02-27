/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Humanize = require("humanize");

var TimeSeriesChart = require("./TimeSeriesChart");

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
        values: framework.used_resources[props.mode]
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
    return _.last(props.totalResources[props.mode]).percentage;
  },

  getUsed: function () {
    var props = this.props;
    return _.last(props.usedResources[props.mode]).percentage;
  },

  getTotalHeadline: function () {
    var props = this.props;
    var max = _.last(props.totalResources[props.mode]).value;
    var str = "Total: ";
    if (props.mode === "cpus") {
      str += max + " CPU";
    } else {
      str += Humanize.filesize(max * 1024 * 1024);
    }
    return str;
  },

  getUsedHeadline: function () {
    var props = this.props;
    var used = this.getUsed();
    var str = "Used: " + used + "% (";
    if (this.props.mode === "cpus") {
      str += _.last(props.usedResources[props.mode]).value + " CPU)";
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
          maxY={this.getMaxY()}
          y={"percentage"} />
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
