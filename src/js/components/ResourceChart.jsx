/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var Humanize = require("humanize");
var React = require("react/addons");

var TimeSeriesChart = require("./TimeSeriesChart");

var ResourceChart = React.createClass({

  displayName: "ResourceChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    maxResources: React.PropTypes.object.isRequired,
    mode: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      maxResources: {
        cpus: 0,
        mem: 0,
        disk: 0
      }
    };
  },

  formatYAxis: function () {
    var mode = this.props.mode;
    var formatPercent = d3.format(".0%");
    var max = this.props.maxResources[mode];
    return function (d) {
      var a = formatPercent(d / max);
      if (d >= max) {
        if (mode === "cpus") {
          a = "100% - " + d + " CPU";
        } else {
          a = "100% - " + Humanize.filesize(d * 1024 * 1024);
        }
      }
      return a;
    };
  },

  render: function () {
    var data = _.map(this.props.data, function (fw) {
      return {
        name: fw.name,
        colorIndex: fw.colorIndex,
        values: fw.values[this.props.mode]
      };
    }, this);

    var margin = {
      left: 20,
      bottom: 40
    };

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <TimeSeriesChart
          data={data}
          formatYAxis={this.formatYAxis}
          minY={0}
          maxY={this.props.maxResources[this.props.mode]}
          margin={margin}
          height={200}
          width={600} />
    );
  }
});

module.exports = ResourceChart;
