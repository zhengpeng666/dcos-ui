/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Humanize = require("humanize");

var StackedBarChart = require("./StackedBarChart");

var getPercentage = function (value, decimalPlaces) {
  var percentage = "-";
  if (!_.isNaN(value * 1)) {
    var factor = Math.pow(10, decimalPlaces);
    percentage = Math.round(value * 100 * factor) / factor;
  }
  return percentage;
};

var ServicesChart = React.createClass({

  displayName: "ServicesChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    stacked: React.PropTypes.bool.isRequired,
    totalResources: React.PropTypes.object.isRequired,
    usedResources: React.PropTypes.object.isRequired,
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      resourceMode: "cpus"
    };
  },

  getFrameworksData: function () {
    var props = this.props;
    return _.map(props.data, function (framework) {
      return {
        name: framework.name,
        colorIndex: framework.colorIndex,
        values: framework.resources[this.state.resourceMode]
      };
    }.bind(this));
  },

  getAllData: function () {
    var props = this.props;
    return [{
      name: "All",
      colorIndex: 0,
      values: props.usedResources[this.state.resourceMode],
    }];
  },

  getData: function () {
    if (this.props.stacked) {
      return this.getFrameworksData();
    } else {
      return this.getAllData();
    }
  },

  getMaxY: function () {
    var props = this.props;
    return _.last(props.totalResources[this.state.resourceMode]).y;
  },

  changeMode: function (mode) {
    this.setState({resourceMode: mode});
  },

  getModeButtons: function () {
    var mode = this.state.resourceMode;
    var buttonNameMap = {
      cpus: "CPU",
      mem: "Memory",
      disk: "Disk"
    };

    return _.map(buttonNameMap, function (value, key) {
      var classSet = React.addons.classSet({
        "button button-large": true,
        "button-primary": mode === key
      });
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <button
            key={key}
            className={classSet}
            onClick={this.changeMode.bind(this, key)}>
          {value}
        </button>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }, this);
  },

  render: function () {
    var margin = {
      left: 20,
      bottom: 40
    };

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div>
        {this.getModeButtons()}
        <StackedBarChart
          data={this.getData()}
          maxY={this.getMaxY()}
          margin={margin}
          ticksY={4}
          height={this.props.height}
          width={this.props.width} />
      </div>
    );
  }
});

module.exports = ServicesChart;
