/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var StackedBarChart = require("./StackedBarChart");

var ServicesChart = React.createClass({

  displayName: "ServicesChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    stacked: React.PropTypes.bool.isRequired,
    totalResources: React.PropTypes.object.isRequired,
    usedResources: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      resourceMode: "cpus",
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

  getStackedBarChart: function () {
    var width = this.state.width;

    if (width != null) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <StackedBarChart
          data={this.getData()}
          maxY={this.getMaxY()}
          ticksY={4}
          width={width} />
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
        {this.getModeButtons()}
        {this.getStackedBarChart()}
      </div>
    );
  }
});

module.exports = ServicesChart;
