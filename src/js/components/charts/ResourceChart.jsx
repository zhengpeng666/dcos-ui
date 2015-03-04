/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Humanize = require("humanize");

var TimeSeriesChart = require("./TimeSeriesChart");

var labelMap = {
  mem: "Memory",
  cpus: "CPU",
  disk: "Disk"
};

function getComputedWidth(obj) {
  var compstyle;
  if (typeof window.getComputedStyle === "undefined") {
    compstyle = obj.currentStyle;
  } else {
    compstyle = window.getComputedStyle(obj);
  }
  return _.foldl(
    ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"],
    function (acc, key) {
      var val = parseInt(compstyle[key], 10);
    if (_.isNaN(val)) {
      return acc;
    } else {
      return acc - val;
    }
  }, obj.offsetWidth);
}

var ResourceChart = React.createClass({

  displayName: "ResourceChart",

  propTypes: {
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
      width: getComputedWidth(this.refs.chartContainer.getDOMNode())
    });
  },

  getData: function () {
    var props = this.props;
    return [{
      name: "All",
      colorIndex: 0,
      values: props.usedResources[props.mode],
    }];
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
    var total = _.last(props.totalResources[props.mode]).value;
    if (props.mode === "cpus") {
      return total + " CPU";
    } else {
      return Humanize.filesize(total * 1024 * 1024, 1024, 0);
    }
  },

  getUsedHeadline: function () {
    var props = this.props;
    var value = _.last(props.usedResources[props.mode]).value;
    if (this.props.mode === "cpus") {
      return "(" + value + " CPU)";
    } else {
      return "(" + Humanize.filesize(value * 1024 * 1024, 1024, 0) + ")";
    }
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
          y="percentage" />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }
    return null;
  },

  render: function () {
    var totalHeadline = this.getTotalHeadline().split(" ");

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="panel">
        <div className="panel-heading text-align-center">
          <h3 className="panel-title">
            {labelMap[this.props.mode]} Overview
          </h3>
        </div>
        <div className="panel-content" ref="chartContainer">
          <div className="row text-align-center">
            <div className="column-small-offset-2 column-small-4">
              <h1 className="unit">{totalHeadline[0]}</h1>
              <h4 className="unit-label text-muted">{totalHeadline[1]} Total</h4>
            </div>
            <div className="column-small-4">
              <h1 className="unit">
                {this.getUsed()}<sup>%</sup>
              </h1>
              <h4 className="unit-label">
                {this.getUsedHeadline()} Used
              </h4>
            </div>
          </div>
          {this.getChart()}
        </div>
      </div>
    );
  }
});

module.exports = ResourceChart;
