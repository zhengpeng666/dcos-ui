/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var BarChart = require("./BarChart");
var ResourceTypes = require("../../constants/ResourceTypes");

// number to fit design of width vs. height ratio
var WIDTH_HEIGHT_RATIO = 4.5;

var ResourceBarChart = React.createClass({

  displayName: "ResourceBarChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    onResourceSelectionChange: React.PropTypes.func.isRequired,
    resources: React.PropTypes.object.isRequired,
    refreshRate: React.PropTypes.number.isRequired,
    resourceType: React.PropTypes.string,
    selectedResource: React.PropTypes.string.isRequired,
    totalResources: React.PropTypes.object.isRequired
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

  getData: function () {
    var props = this.props;

    if (props.data.length === 0) {
      return [];
    }

    var selectedResource = this.props.selectedResource;
    return [{
        id: "used_resources",
        name: selectedResource + " allocated",
        colorIndex: ResourceTypes[selectedResource].colorIndex,
        values: props.resources[selectedResource]
    }];
  },

  getMaxY: function () {
    var props = this.props;
    return _.last(props.totalResources[this.props.selectedResource])[props.y];
  },

  handleSelectedResourceChange: function (selectedResource) {
    this.props.onResourceSelectionChange(selectedResource);
  },

  getModeButtons: function () {
    var selectedResource = this.props.selectedResource;

    return _.map(ResourceTypes, function (info, key) {
      var classSet = React.addons.classSet({
        "button button-small button-stroke button-inverse": true,
        "active": selectedResource === key
      });

      return (
        <button
            key={key}
            className={classSet + " path-color-" + info.colorIndex}
            onClick={this.handleSelectedResourceChange.bind(this, key)}>
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
    var classSet = React.addons.classSet({
      "button button-small button-stroke button-inverse": true,
      "disabled": true
    });

    return (
      <div className="button-group legend">
        <button className={classSet}>
          <span className={"line path-color-" + info.colorIndex}></span>
          <span>{info.label} Allocated</span>
        </button>
      </div>
    );
  },

  getHeadline: function (info) {
    var headline = info.label + " Allocation Rate";

    return (
      <div>
        <h3 className="flush-top flush-bottom">
          {headline}
        </h3>
        <p className="flush-bottom">
          {this.props.data.length + " Total " + this.props.resourceType}
        </p>
      </div>
    );
  },

  render: function () {
    var info = ResourceTypes[this.props.selectedResource];

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
