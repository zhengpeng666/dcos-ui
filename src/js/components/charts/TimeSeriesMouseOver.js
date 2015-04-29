/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");

var Maths = require("../../utils/Maths");

var TimeSeriesMouseOver = React.createClass({

  displayName: "TimeSeriesMouseOver",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    getBoundingBox: React.PropTypes.func.isRequired,
    height: React.PropTypes.number.isRequired,
    margin: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired,
    xScale: React.PropTypes.func.isRequired,
    y: React.PropTypes.string.isRequired,
    yCaption: React.PropTypes.string.isRequired,
    yScale: React.PropTypes.func.isRequired,
    addMouseHandler: React.PropTypes.func.isRequired,
    removeMouseHandler: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    this.props.addMouseHandler(this.handleMouseMove, this.handleMouseOut);
  },

  componentWillUnmount: function () {
    this.props.removeMouseHandler(this.handleMouseMove, this.handleMouseOut);
  },

  calculateMousePositionInGraph: function (e) {
    var boundingBox = this.props.getBoundingBox();
    var mouse = {
      x: e.clientX || e.pageX,
      y: e.clientY || e.pageY
    };

    if (mouse.x < boundingBox.left ||
      mouse.y < boundingBox.top ||
      mouse.x > boundingBox.right ||
      mouse.y > boundingBox.bottom) {
      return false;
    }

    mouse.x -= boundingBox.left;
    mouse.y -= boundingBox.top;

    return mouse;
  },

  handleMouseMove: function (e) {
    var mouse = this.calculateMousePositionInGraph(e);

    // This means that mouse is out of bounds
    if (mouse === false) {
      return;
    }

    var props = this.props;
    var margin = props.margin;
    var domain = props.xScale.domain();

    var firstDataSet = _.first(props.data);
    // 6 - how many data points we don't show
    var hiddenDataPoints = 6;
    // find the data point at the given mouse position
    var index = mouse.x *
      (firstDataSet.values.length - hiddenDataPoints - 1) /
      (props.width - margin.right - margin.left);
    index = Math.round(index + hiddenDataPoints - 1);

    d3.select(this.refs.xMousePosition.getDOMNode())
      .transition()
        .duration(50)
        .style("stroke", "rgba(255,255,255,0.5")
        .attr("x1", mouse.x + margin.left)
        .attr("x2", mouse.x + margin.left);

    d3.select(this.refs.yMousePosition.getDOMNode())
      .transition()
        .duration(50)
        .style("stroke", "rgba(255,255,255,0.5")
        .attr("y1", props.yScale(firstDataSet.values[index][props.y]))
        .attr("y2", props.yScale(firstDataSet.values[index][props.y]));

    d3.select(this.refs.yAxisCurrent.getDOMNode())
      .transition()
      .duration(50)
      .attr("y", props.yScale(firstDataSet.values[index][props.y]) + 3)
      .text(firstDataSet.values[index][props.y] + props.yCaption);

    // An extra -2 on each because we show the extra data point at the end
    var mappedValue = Maths.mapValue(index, {
      min: firstDataSet.values.length - 2,
      max: 5
    });
    var value = Maths.unmapValue(mappedValue, {
      min: Math.abs(domain[1]),
      max: Math.abs(domain[0])
    });
    value = Math.round(value);

    var characterWidth = 7;
    var xPosition = mouse.x - value.toString().length * characterWidth;
    if (value === 0) {
      xPosition += characterWidth / 2;
    } else {
      value = "-" + value + "s";
    }
    d3.select(this.refs.xAxisCurrent.getDOMNode())
      .transition()
      .duration(50)
      .attr("x", xPosition)
      .text(value);
  },

  handleMouseOut: function () {
    d3.select(this.refs.yMousePosition.getDOMNode()).interrupt()
      .style("stroke", "rgba(255,255,255,0");
    d3.select(this.refs.xMousePosition.getDOMNode()).interrupt()
      .style("stroke", "rgba(255,255,255,0");
    d3.select(this.refs.xAxisCurrent.getDOMNode())
      .text("");
    d3.select(this.refs.yAxisCurrent.getDOMNode())
      .text("");
  },

  render: function () {
    var margin = this.props.margin;
    var height = this.props.height - (margin.bottom * 1.25) - margin.top;

    return (
      <g>
        <g className="x axis">
          <text className="current-value" ref="xAxisCurrent"
            y={margin.bottom}
            transform={"translate(" + margin.left + "," + height + ")"}>
          </text>
        </g>
        <g className="y axis">
          <text className="current-value shadow" ref="yAxisCurrent"
            style={{textAnchor: "end"}}
            transform={"translate(" + (margin.left - 9) + ",0)"}>
          </text>
        </g>
        <line ref="xMousePosition"
          y1={margin.top}
          y2={this.props.height - margin.bottom - margin.top} />
        <line ref="yMousePosition"
          x1={margin.left}
          x2={this.props.width} />
      </g>
    );
  }
});

module.exports = TimeSeriesMouseOver;
