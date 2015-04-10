/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var BarChart = require("./BarChart");

// number to fit design of width vs. height ratio
var WIDTH_HEIGHT_RATIO = 4.5;

var infoMap = {
  cpus: {label: "CPU", colorIndex: 0},
  mem: {label: "Memory", colorIndex: 3},
  disk: {label: "Disk", colorIndex: 5}
};

var ResourceBarChart = React.createClass({

  displayName: "ResourceBarChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    resources: React.PropTypes.object.isRequired,
    totalResources: React.PropTypes.object.isRequired,
    refreshRate: React.PropTypes.number.isRequired,
    resourceType: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      data: [],
      totalResources: {},
      y: "percentage",
      refreshRate: 0,
      resourceType: ""
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
        colorIndex: infoMap[this.state.resourceMode].colorIndex,
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

    return _.map(infoMap, function (info, key) {
      var classSet = React.addons.classSet({
        "button button-stroke button-inverse": true,
        "active": mode === key
      });

      return (
        <button
            key={key}
            className={classSet + " path-color-" + info.colorIndex}
            onClick={this.changeMode.bind(this, key)}>
          {info.label}
        </button>
      );
    }, this);
  },

  getBarChart: function () {
    return (
      <Chart calcHeight={function (w) { return w / WIDTH_HEIGHT_RATIO; }}>
        <BarChart
          data={this.getData()}
          maxY={this.getMaxY()}
          ticksY={4}
          y={this.props.y}
          refreshRate={this.props.refreshRate} />
      </Chart>
    );
  },

  getLegend: function (info) {
    return (
      <ul className="legend list-unstyled list-inline inverse">
        <li className="legend-item">
          <span className={"line path-color-" + info.colorIndex}></span>
          <strong>
            {info.label} Allocated
          </strong>
        </li>
      </ul>
    );
  },

  getHeadline: function (info) {
    var headline = info.label + " Allocation Per Second";

    return (
      <div>
        <h3 className="flush-top">
          {headline}
        </h3>
        <p className="flush-bottom">
          {this.props.data.length + " Total " + this.props.resourceType}
        </p>
      </div>
    );
  },

  render: function () {
    var info = infoMap[this.state.resourceMode];

    return (
      <div className="chart panel">
        <div className="panel-heading panel-heading-large">
          <div className="panel-options-left button-group">
            {this.getModeButtons()}
          </div>
          <div className="panel-title">
            {this.getHeadline(info)}
          </div>
          <div className="panel-options-right">
            {this.getLegend(info)}
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
