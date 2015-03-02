/** @jsx React.DOM */

var _ = require("underscore");
var $ = require("jquery");
var React = require("react/addons");

var OverlapBarChart = require("./OverlapBarChart");

var buttonNameMap = {
  cpus: "CPU",
  mem: "Memory",
  disk: "Disk"
};

var ServicesChart = React.createClass({

  displayName: "ServicesChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    stacked: React.PropTypes.bool.isRequired,
    allocatedResources: React.PropTypes.object.isRequired,
    totalResources: React.PropTypes.object.isRequired,
    usedResources: React.PropTypes.object.isRequired
  },

  calcChartSizes: function (props) {
    var margin = {
      top: 0,
      left: 40,
      bottom: 40,
    };
    var width = this.state.width;
    var height = Math.round(width / 3 - margin.bottom - margin.top);
    return _.extend(props, {
      width: width,
      height: height,
      margin: margin
    });
  },

  getInitialState: function () {
    return {
      resourceMode: "cpus",
      width: null
    };
  },

  updateWidth: function () {
    // Don't know why this is empty
    // this.refs.panelContent.getDOMNode().style.paddingLeft;

    var padding =
      parseInt($(this.refs.panelContent.getDOMNode()).css("padding-left"), 10) +
      parseInt($(this.refs.panelContent.getDOMNode()).css("padding-right"), 10);

    this.setState({
      width: this.getDOMNode().offsetWidth - padding
    });
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

  getFrameworksData: function () {
    var props = this.props;
    return _.map(props.data, function (framework) {
      return {
        id: framework.id,
        name: framework.name,
        colorIndex: framework.colorIndex,
        values: framework.used_resources[this.state.resourceMode]
      };
    }.bind(this));
  },

  getAllData: function () {
    var props = this.props;

    return [{
      id: "allocatedResources",
      name: "Allocated",
      colorIndex: 0,
      values: props.allocatedResources[this.state.resourceMode]
    }, {
      id: "usedResources",
      name: "Used",
      colorIndex: 1,
      values: props.usedResources[this.state.resourceMode]
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

  getOverlapBarChart: function () {
    var props = this.calcChartSizes(this.props);

    if (props.width != null) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <OverlapBarChart
          data={this.getData()}
          maxY={this.getMaxY()}
          ticksY={4}
          width={props.width}
          height={props.height}
          margin={props.margin}
          y="percentage" />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }

    return null;
  },

  getLegend: function () {
    var props = this.calcChartSizes(this.props);
    var maxY = this.getMaxY();

    var frameworks = _.filter(this.getData(), function (framework) {
      return _.find(framework.values, function (val) {
        return props.height * val["percentage"] / maxY >= 1;
      });
    });

    return _.map(frameworks, function (service) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <li className="service" key={service.id}>
          <span
            className={"line color-" + service.colorIndex}></span>
          <strong>{buttonNameMap[this.state.resourceMode]} {service.name}</strong>
        </li>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }.bind(this));
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="panel services-chart">
        <div className="panel-heading">
          <div className="button-collection">
            {this.getModeButtons()}
          </div>
          <div className="services-legend">
            <ul className="list-unstyled list-inline inverse">
              {this.getLegend()}
            </ul>
          </div>
        </div>
        <div className="panel-content" ref="panelContent">
          {this.getOverlapBarChart()}
        </div>
      </div>
    );
  }
});

module.exports = ServicesChart;
