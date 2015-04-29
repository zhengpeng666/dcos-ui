/** @jsx React.DOM */

var d3 = require("d3");
var React = require("react/addons");

var TimeSeriesArea = React.createClass({

  displayName: "TimeSeriesArea",

  propTypes: {
    className: React.PropTypes.string,
    // "M-22.179096201829775,200C-18.48258016819148,200..."
    path: React.PropTypes.string.isRequired,
    // "M-22.179096201829775,200C-18.48258016819148,200..."
    line: React.PropTypes.string.isRequired,
    transitionTime: React.PropTypes.number.isRequired,
    position: React.PropTypes.array.isRequired
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
      <g>
        <path className={"area " + this.props.className} d={this.props.path} />
        <path className={"line " + this.props.className} d={this.props.line} />
      </g>
    );
  }
});

module.exports = TimeSeriesArea;
