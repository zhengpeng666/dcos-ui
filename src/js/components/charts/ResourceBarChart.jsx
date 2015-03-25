/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var BarChart = require("./BarChart");

// number to fit design of width vs. height ratio
var WIDTH_HEIGHT_RATIO = 4.5;

var buttonNameMap = {
  cpus: "CPU",
  mem: "Memory",
  disk: "Disk"
};

var ResourceBarChart = React.createClass({

  displayName: "ResourceBarChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    resources: React.PropTypes.object.isRequired,
    totalResources: React.PropTypes.object.isRequired,
    refreshRate: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      data: [],
      totalResources: {},
      y: "percentage",
      refreshRate: 0
    };
  },

  getInitialState: function () {
    return {
      resourceMode: "cpus"
    };
  },

  getData: function () {
    var props = this.props;

    if (props.data.length === 0) {
      return [];
    }

    return [{
        id: "used_resources",
        name: this.state.resourceMode + " allocated",
        colorIndex: 0,
        values: props.resources[this.state.resourceMode]
    }];
  },

  getMaxY: function () {
    var props = this.props;
    return _.last(props.totalResources[this.state.resourceMode])[props.y];
  },

  changeMode: function (mode) {
    this.setState({resourceMode: mode});
  },

  getModeButtons: function () {
    var mode = this.state.resourceMode;

    return _.map(buttonNameMap, function (value, key) {
      var classSet = React.addons.classSet({
        "button button-stroke button-inverse": true,
        "active": mode === key
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

  getBarChart: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Chart calcHeight={function (w) { return w/WIDTH_HEIGHT_RATIO; }}>
        <BarChart
          data={this.getData()}
          maxY={this.getMaxY()}
          ticksY={4}
          y={this.props.y}
          refreshRate={this.props.refreshRate} />
      </Chart>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getLegend: function () {
    var y = this.props.y;
    var frameworks = _.filter(this.getData(), function (framework) {
      return _.find(framework.values, function (val) {
        return val[y];
      });
    });

    if (frameworks.length === 0) {
      return null;
    }

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <ul className="legend list-unstyled list-inline inverse">
        <li className="legend-item">
          <span className="line path-color-0"></span>
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
      <div className="chart panel">
        <div className="panel-heading panel-heading-large">
          <div className="panel-title">
            <div className="button-group">
              {this.getModeButtons()}
            </div>
            {this.getLegend()}
          </div>
        </div>
        <div className="panel-content" ref="panelContent">
          {this.getBarChart()}
        </div>
      </div>
    );
  }
});

module.exports = ResourceBarChart;
