/** @jsx React.DOM */

var React = require("react/addons");

var ProgressBar = React.createClass({

  displayName: "ProgressBar",

  propTypes: {
    colorIndex: React.PropTypes.number,
    max: React.PropTypes.number,
    value: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      colorIndex: 1,
      max: 100,
      value: 0
    };
  },

  componentDidMount: function () {
    setTimeout(this.applyWidth.bind(this, this.props), 100);
  },

  componentDidUpdate: function () {
    this.applyWidth(this.props);
  },

  applyWidth: function (props) {
    var bar = this.refs.bar.getDOMNode();
    var newValue = (props.value / props.max * 100) + "%";
    var oldValue = bar.style.width;

    if (oldValue !== newValue) {
      bar.style.width = newValue;
    }
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
