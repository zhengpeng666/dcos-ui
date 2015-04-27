/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var ValueTypes = require("../../constants/ValueTypes");

var TimeSeriesLabel = React.createClass({

  displayName: "TimeSeriesLabel",

  propTypes: {
    colorIndex: React.PropTypes.number,
    currentValue: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    subHeading: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    y: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      y: ValueTypes.PERCENTAGE,
      colorIndex: 0
    };
  },

  shouldComponentUpdate: function (nextProps) {
    return !_.isEqual(this.props, nextProps);
  },

  render: function () {
    var props = this.props;

    var percentageClassSet = React.addons.classSet({
      "hidden": props.y !== ValueTypes.PERCENTAGE
    });

    return (
      <div className="text-align-center">
        <p className="h1-jumbo unit">
          {props.currentValue}
          <sup className={percentageClassSet}>%</sup>
        </p>
        <p className={"h4 unit-label path-color-" + props.colorIndex}>
          {props.subHeading}
        </p>
      </div>
    );
  }
});

module.exports = TimeSeriesLabel;
