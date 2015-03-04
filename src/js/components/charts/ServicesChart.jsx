/** @jsx React.DOM */

var _ = require("underscore");
var $ = require("jquery");
var React = require("react/addons");

var Chart = require("./Chart");
var StackedBarChart = require("./StackedBarChart");

var buttonNameMap = {
  cpus: "CPU",
  mem: "Memory",
  disk: "Disk"
};

var ServicesChart = React.createClass({

  displayName: "ServicesChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    totalResources: React.PropTypes.object.isRequired,
    usedResources: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      resourceMode: "cpus"
    };
  },

  getData: function () {
    var props = this.props;
    return _.map(props.data, function (framework) {
      return {
        id: framework.id,
        name: framework.name,
        colorIndex: 0,
        values: framework.used_resources[this.state.resourceMode]
      };
    }.bind(this));
  },

  getMaxY: function () {
    var props = this.props;
    return _.last(props.totalResources[this.state.resourceMode]).percentage;
  },

  changeMode: function (mode) {
    this.setState({resourceMode: mode});
  },

  getModeButtons: function () {
    var mode = this.state.resourceMode;

    return _.map(buttonNameMap, function (value, key) {
      var classSet = React.addons.classSet({
        "button": true,
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
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Chart calcHeight={function (w) { return w/4; }}>
        <StackedBarChart
          data={this.getData()}
          maxY={this.getMaxY()}
          ticksY={4}
          y="percentage" />
      </Chart>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getLegend: function () {
    var frameworks = _.filter(this.getData(), function (framework) {
      return _.find(framework.values, function (val) {
        return val.percentage;
      });
    });

    if (frameworks.length === 0) {
      return null;
    }

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <ul className="services-legend list-unstyled list-inline inverse">
        <li className="service">
          <span
            className={"line color-0"}></span>
          <strong>
            {buttonNameMap[this.state.resourceMode]} Allocated
          </strong>
        </li>
      </ul>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="panel services-chart">
        <div className="panel-heading">
          <div className="button-group">
            {this.getModeButtons()}
          </div>
          {this.getLegend()}
        </div>
        <div className="panel-content" ref="panelContent">
          {this.getStackedBarChart()}
        </div>
      </div>
    );
  }
});

module.exports = ServicesChart;
