/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var BarChart = require("./BarChart");

var buttonNameMap = {
  cpus: "CPU",
  mem: "Memory",
  disk: "Disk"
};

var ServicesChart = React.createClass({

  displayName: "ServicesChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    totalFrameworksResources: React.PropTypes.object.isRequired,
    totalResources: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      data: [],
      totalResources: {},
      y: "percentage"
    };
  },

  getInitialState: function () {
    return {
      resourceMode: "cpus"
    };
  },

  getStackedData: function () {
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

  getData: function () {
    var props = this.props;
    var y = props.y;

    if (props.data.length === 0) {
      return [];
    }

    return [{
        id: "used_resources",
        name: this.state.resourceMode + " allocated",
        colorIndex: 0,
        values: props.totalFrameworksResources[this.state.resourceMode]
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

  getBarChart: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Chart calcHeight={function (w) { return w/4; }}>
        <BarChart
          data={this.getData()}
          maxY={this.getMaxY()}
          ticksY={4}
          y={this.props.y} />
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
      <ul className="services-legend list-unstyled list-inline inverse">
        <li className="service">
          <span className={"line color-0"}></span>
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
          {this.getBarChart()}
        </div>
      </div>
    );
  }
});

module.exports = ServicesChart;
