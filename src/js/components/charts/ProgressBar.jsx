/** @jsx React.DOM */

var d3 = require("d3");
var React = require("react/addons");

var ProgressBar = React.createClass({

  displayName: "ProgressBar",

  propTypes: {
    colorIndex: React.PropTypes.number,
    max: React.PropTypes.number,
    tweenDuration: React.PropTypes.number,
    value: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      colorIndex: 1,
      max: 100,
      tweenDuration: 600,
      value: 0
    };
  },

  componentDidMount: function () {
    this.animate(this.props);
  },

  componentDidUpdate: function () {
    this.animate(this.props);
  },

  animate: function (props) {
    var bar = this.refs.bar.getDOMNode();
    var newValue = (props.value / props.max * 100) + "%";
    var oldValue = bar.style.width;

    if (oldValue === newValue) {
      return;
    }

    d3.select(bar).interrupt()
      .transition()
        .duration(this.props.tweenDuration)
        .ease("linear")
        .styleTween("width", function () {
          return d3.interpolate(oldValue, newValue);
        });
  },

  render: function () {
    var props = this.props;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="progress-bar">
        <div ref="bar"
          className={"bar color-" + props.colorIndex}
          style={{width: "0%"}} />
      </div>
    );
  }
});

module.exports = ProgressBar;
