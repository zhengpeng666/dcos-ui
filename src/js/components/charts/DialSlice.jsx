/** @jsx React.DOM */

var React = require("react/addons");

var DialSlice = React.createClass({

  displayName: "DialSlice",

  propTypes: {
    colorIndex: React.PropTypes.number,
    path: React.PropTypes.string.isRequired
  },

  render: function () {
    var classes = {
      "arc": true
    };
    if (this.props.colorIndex != null) {
      classes["path-color-" + this.props.colorIndex] = true;
    }
    var classSet = React.addons.classSet(classes);
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <g className={classSet}>
        <path d={this.props.path} />
      </g>
    );
  }
});

module.exports = DialSlice;
