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

  /**
   * for animation purposes we want to always start at 0
   * then update the values when we receive props.
   **/
  getInitialState: function () {
    return {
      value: 0
    };
  },

  componentDidMount: function () {
    this.setState({value: this.props.value});
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({value: nextProps.value});
  },

  render: function () {
    var props = this.props;
    var state = this.state;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="progress-bar">
        <div key="bar" ref="bar"
          className={"bar color-" + props.colorIndex}
          style={{width: state.value + "%"}} />
      </div>
    );
  }
});

module.exports = ProgressBar;
