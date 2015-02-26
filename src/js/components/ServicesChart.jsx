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
    this.setState({
      width: this.getDOMNode().offsetWidth
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
        values: framework.resources[this.state.resourceMode]
      };
    }.bind(this));
  },

  getAllData: function () {
    var props = this.props;
    return [{
      id: "all",
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
    var props = this.calcChartSizes(this.props);

    if (props.width != null) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <StackedBarChart
          data={this.getData()}
          maxY={this.getMaxY()}
          ticksY={4}
          width={props.width}
          height={props.height}
          margin={props.margin} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }

    return null;
  },

  getServiceLegend: function () {
    var props = this.calcChartSizes(this.props);
    var maxY = this.getMaxY();

    var frameworks = _.filter(this.getData(), function (framework) {
      return _.find(framework.values, function (val) {
        return props.height * (val.y / maxY) >= 1;
      });
    });

    return _.map(frameworks, function (service) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <li className="service" key={service.id}>
          <span
            className={"line color-" + service.colorIndex}></span>
          <strong>{service.name}</strong>
        </li>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="container-pod">
        <div className="button-collection">
          {this.getModeButtons()}
        </div>
        {this.getStackedBarChart()}
        <div className="services-legend">
          <ul className="list-unstyled list-inline inverse">
            {this.getServiceLegend()}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = ServicesChart;
