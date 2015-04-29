/** @jsx React.DOM */

var d3 = require("d3");
var React = require("react/addons");

var AnitmationCircle = React.createClass({

  displayName: "AnitmationCircle",

  propTypes: {
    className: React.PropTypes.string,
    transitionTime: React.PropTypes.number.isRequired,
    position: React.PropTypes.array.isRequired,
    r: React.PropTypes.number,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      r: 4,
      cx: 0,
      cy: 0
    };
  },

  componentDidMount: function () {
    d3.select(this.getDOMNode())
      .attr("transform", "translate(" + this.props.position + ")");
  },

  componentWillReceiveProps: function (props) {
    d3.select(this.getDOMNode())
      .transition()
      .duration(props.transitionTime)
      .ease("linear")
      .attr("transform", "translate(" + props.position + ")");
  },

  render: function () {
    var props = this.props;
    var r = props.r;
    var className = props.className;

    return (
      <circle className={className} r={r} cx={props.cx} cy={props.cy} />
    );
  }
});

module.exports = AnitmationCircle;
