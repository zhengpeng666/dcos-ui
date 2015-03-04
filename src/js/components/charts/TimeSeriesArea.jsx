/** @jsx React.DOM */

var d3 = require("d3");
var React = require("react/addons");

var TimeSeriesArea = React.createClass({

  displayName: "TimeSeriesArea",

  propTypes: {
    // "M-22.179096201829775,200C-18.48258016819148,200..."
    path: React.PropTypes.string.isRequired,
    transitionTime: React.PropTypes.number.isRequired,
    position: React.PropTypes.number.isRequired,
  },

  shouldComponentUpdate: function (props) {
    // XXX - This is probably an anti-pattern with react. I'm not sure how to
    // get the animation stuff reading the attr and transitioning
    d3.select(this.getDOMNode()).interrupt()
      .attr("transform", null)
      .transition()
      .duration(props.transitionTime)
      .ease("linear")
      .attr("transform", "translate(" + props.position + ")");

    return true;
  },

  render: function () {

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <path
          transform={"translate(" + [0, -20] + ")"}
          className={this.props.className}
          d={this.props.path} />
    );
  }
});

module.exports = TimeSeriesArea;
