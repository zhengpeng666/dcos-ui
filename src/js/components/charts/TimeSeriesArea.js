/** @jsx React.DOM */

var d3 = require("d3");
var React = require("react/addons");

var TimeSeriesArea = React.createClass({

  displayName: "TimeSeriesArea",

  propTypes: {
    // "M-22.179096201829775,200C-18.48258016819148,200..."
    path: React.PropTypes.string.isRequired,
    transitionTime: React.PropTypes.number.isRequired,
    position: React.PropTypes.number.isRequired
  },

  componentDidMount: function () {
    var props = this.props;

    d3.select(this.getDOMNode())
      .transition()
      .duration(props.transitionTime)
      .ease("linear")
      .attr("transform", "translate(" + props.position + ")");
  },

  componentWillReceiveProps: function (props) {
    d3.select(this.getDOMNode()).interrupt()
      .attr("transform", null)
      .transition()
      .duration(props.transitionTime)
      .ease("linear")
      .attr("transform", "translate(" + props.position + ")");
  },

  render: function () {
    return (
      <path d={this.props.path} />
    );
  }
});

module.exports = TimeSeriesArea;
