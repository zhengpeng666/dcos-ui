/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

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
    ]).isRequired
  },

  getDefaultProps: function () {
    return {
      colorIndex: 0
    };
  },

  shouldComponentUpdate: function (nextProps) {
    return !_.isEqual(this.props, nextProps);
  },

  render: function () {
    var props = this.props;

    return (
      <div className="text-align-center">
        <p className="h1-jumbo unit">
          {props.currentValue}
          <sup>%</sup>
        </p>
        <p className={"h4 unit-label path-color-" + props.colorIndex}>
          {props.subHeading}
        </p>
      </div>
    );
  }
});

module.exports = TimeSeriesLabel;
