/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");

var AnimationCircle = require("./AnimationCircle");
var ChartMixin = require("../../mixins/ChartMixin");
var InternalStorageMixin = require("../../mixins/InternalStorageMixin");
var Maths = require("../../utils/Maths");
var TimeSeriesArea = require("./TimeSeriesArea");
var ValueTypes = require("../../constants/ValueTypes");

var TimeSeriesChart = React.createClass({

  displayName: "TimeSeriesChart",

  mixins: [ChartMixin, InternalStorageMixin],

  propTypes: {
    // [{name: "Area Name", values: [{date: some time, y: 0}]}]
    data: React.PropTypes.array.isRequired,
    maxY: React.PropTypes.number,
    ticksY: React.PropTypes.number,
    y: React.PropTypes.string,
    yFormat: React.PropTypes.string,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    refreshRate: React.PropTypes.number.isRequired,
    strokeOffset: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      maxY: 10,
      ticksY: 3,
      y: "y",
      yFormat: ValueTypes.PERCENTAGE,
      margin: {
        top: 10,
        left: 45,
        bottom: 25,
        right: 5
      },
      refreshRate: 0,
      strokeOffset: 2
    };
  },

  componentWillMount: function () {
    var xScale = this.getXScale(this.props);
    var xTimeScale = this.getXTimeScale(this.props);
    var yScale = this.getYScale(this.props);

    var data = {
      area: this.getArea(xTimeScale, yScale),
      stack: this.getStack(),
      xScale: xScale,
      xTimeScale: xTimeScale,
      xMouseValue: null,
      yScale: yScale,
      yMouseValue: null,
      clipPathID: _.uniqueId("clip")
    };

    this.internalStorage_set(data);
  },

  componentDidMount: function () {
    var data = this.internalStorage_get();
    var el = this.getDOMNode();
    var props = this.props;

    this.renderAxis(props, data.xScale, data.yScale);
    this.createClipPath();

    el.addEventListener("mousemove", this.handleMouseMove);
    el.addEventListener("mouseout", this.handleMouseOut);
  },

  componentWillUnmount: function () {
    var el = this.getDOMNode();
    el.removeEventListener("mousemove", this.handleMouseMove);
    el.removeEventListener("mouseout", this.handleMouseOut);
  },

  componentDidUpdate: function () {
    this.updateClipPath();
  },

  createClipPath: function () {
    var data = this.internalStorage_get();
    var el = this.getDOMNode();

    // create clip path for areas and x-axis
    d3.select(el)
      .append("defs")
      .append("clipPath")
        .attr("id", data.clipPathID)
        .append("rect");

    this.updateClipPath();
  },

  updateClipPath: function () {
    var data = this.internalStorage_get();
    var props = this.props;
    var margin = props.margin;
    var width = props.width - margin.right - margin.left;
    // includes x-axis as we want to clip that as well
    var height = props.height - margin.top - margin.top - margin.bottom;
    var transform = "translate(" + margin.left + "," + margin.top + ")";

    d3.select("#" + data.clipPathID + " rect")
      .attr({
        width: width,
        height: height,
        transform: transform
      });
  },

  handleMouseMove: function (e) {
    var data = this.internalStorage_get();
    var mouse = this.calculateMousePositionInGraph(e);

    // This means that mouse is out of bounds
    if (mouse === false) {
      return;
    }

    var props = this.props;
    var margin = props.margin;
    var domain = this.internalStorage_get().xScale.domain();
    var yCaption = "%";
    if (props.yFormat === ValueTypes.ABSOLUTE) {
      yCaption = "";
    }

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
        .attr("y1", data.yScale(firstDataSet.values[index][props.y]))
        .attr("y2", data.yScale(firstDataSet.values[index][props.y]));

    d3.select(this.refs.yAxisCurrent.getDOMNode())
      .transition()
      .duration(50)
      .attr("y", data.yScale(firstDataSet.values[index][props.y]) + 3)
      .text(firstDataSet.values[index][props.y] + yCaption);

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

  calculateMousePositionInGraph: function (e) {
    var el = this.getDOMNode();
    var props = this.props;
    var margin = props.margin;
    var elPosition = el.getBoundingClientRect();
    var containerPositions = {
      top: elPosition.top + margin.top,
      right: elPosition.left + props.width - margin.right,
      bottom: elPosition.top + props.height - margin.bottom,
      left: elPosition.left + margin.left
    };
    var mouse = {
      x: e.clientX || e.pageX,
      y: e.clientY || e.pageY
    };

    if (mouse.x < containerPositions.left ||
      mouse.y < containerPositions.top ||
      mouse.x > containerPositions.right ||
      mouse.y > containerPositions.bottom) {
      return false;
    }

    mouse.x -= containerPositions.left;
    mouse.y -= containerPositions.top;

    return mouse;
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

  getArea: function (xTimeScale, yScale) {
    var props = this.props;
    var y = props.y;

    return d3.svg.area()
      .x(function (d) { return xTimeScale(d.date); })
      .y0(function (d) { return yScale(d.y0 - props.strokeOffset); })
      .y1(function (d) { return yScale(d.y0 + d[y]); })
      .interpolate("monotone");
  },

  getStack: function () {
    return d3.layout.stack()
      .values(function (d) { return d.values; })
      .x(function (d) { return d.date; });
  },

  getXTickValues: function (xScale) {
    var domain = xScale.domain();
    var mean = Maths.mean(domain);

    return [domain[0], mean, domain[domain.length - 1]];
  },

  getXTimeScale: function (props) {
    var date = Date.now();
    var dateDelta = Date.now();

    var firstDataSet = _.first(props.data);
    if (firstDataSet != null) {
      var values = firstDataSet.values;
      // [first date - 1, last date - 1]
      // ristrict x domain to have extra point outside of graph area,
      // since we are animating the graph in from right
      date = values[1].date;
      dateDelta = values[values.length - 2 - 1].date;
    }

    return d3.time.scale()
      .range([0, props.width - props.margin.right])
      .domain([date, dateDelta]);
  },

  getYScale: function (props) {
    var margin = props.margin;

    return d3.scale.linear()
      // give a little space in the top for the number
      .range([props.height - margin.bottom - margin.top, margin.top])
      .domain([0, props.maxY]);
  },

  formatYAxis: function (ticks, maxY) {
    if (this.props.yFormat === ValueTypes.ABSOLUTE) {
      return function (d) {
        if (d >= maxY) {
          return maxY;
        }

        return d;
      };
    }

    var formatPercent = d3.scale.linear().tickFormat(ticks, ".0%");

    return function (d) {
      if (d >= maxY) {
        return "100%";
      }

      return formatPercent(d / maxY);
    };
  },

  renderAxis: function (props, xScale, yScale) {
    var margin = props.margin;
    var firstDataSet = _.first(props.data);

    if (firstDataSet != null) {
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickValues(this.getXTickValues(xScale))
        .tickFormat(this.formatXAxis)
        .orient("bottom");
      var height = props.height - margin.bottom - margin.top;
      d3.select(this.refs.xAxis.getDOMNode()).interrupt()
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis);
    }

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(props.ticksY)
      .tickFormat(this.formatYAxis(props.ticksY, props.maxY))
      .orient("left");
    d3.select(this.refs.yAxis.getDOMNode())
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(yAxis);

    d3.select(this.refs.grid.getDOMNode())
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(
        d3.svg.axis().scale(yScale)
          .orient("left")
          .ticks(props.ticksY)
          .tickSize(-props.width + margin.left + margin.right, 0, 0)
          .tickFormat("")
      );
  },

  componentWillReceiveProps: function (nextProps) {
    var xScale = this.getXScale(nextProps);
    var xTimeScale = this.getXTimeScale(nextProps);
    var yScale = this.getYScale(nextProps);

    // The d3 axis helper requires a <g> element passed into do its work. This
    // happens after mount and ends up keeping the axis code outside of react
    // unfortunately.
    // Only update axis when they need updating.
    if (!_.isEqual(_.omit(nextProps, "data"), _.omit(this.props, "data"))) {
      this.renderAxis(nextProps, xScale, yScale);
    }

    this.internalStorage_update({
      area: this.getArea(xTimeScale, yScale),
      xTimeScale: xTimeScale,
      xScale: xScale,
      yScale: yScale
    });
  },

  getTransitionTime: function (data) {
    // look at the difference between the last and the third last point
    // to calculate transition time
    var l = data.length - 1;
    return (data[l].date - data[l - 1].date) / 1;
  },

  getPosition: function (values) {
    var data = this.internalStorage_get();
    var firstDataSet = _.first(values);
    var date = Date.now();

    if (firstDataSet != null) {
      date = firstDataSet.date;
    }

    return data.xTimeScale(date);
  },

  getCirclePosition: function (obj) {
    var data = this.internalStorage_get();
    var props = this.props;
    var lastestVisibleDataPoint = obj.values[obj.values.length - 2];

    // [stay in x-value, most recent y - height of chart]
    return [
      0,
      data.yScale(lastestVisibleDataPoint[props.y]) -
      props.height + props.margin.top + props.margin.bottom
    ];
  },

  getAreaList: function () {
    var data = this.internalStorage_get();
    var props = this.props;
    var clipPath = "url(#" + data.clipPathID + ")";

    // stack before drawing!
    return _.map(data.stack(props.data), function (obj, i) {
      var classes = {
        "area": true
      };
      classes["path-color-" + obj.colorIndex] = true;

      var transitionTime = this.getTransitionTime(obj.values);
      // y0 of lastest visible obj + account for stroke size
      var initialPosition = data.yScale(obj.values[obj.values.length - 2].y0);

      return (
        <g className={React.addons.classSet(classes)} key={i}>
          <AnimationCircle
            transitionTime={transitionTime}
            position={this.getCirclePosition(obj)}
            cx={props.width - props.margin.right}
            cy={initialPosition} />
          <g clip-path={clipPath}>
            <TimeSeriesArea
              path={data.area(obj.values)}
              name={obj.name}
              transitionTime={transitionTime}
              position={this.getPosition(obj.values)} />
          </g>
        </g>
      );
    }, this);
  },

  getStripes: function (number) {
    var props = this.props;
    var margin = props.margin;
    var width = (props.width - margin.left - margin.right) / (2 * number);
    return _.map(_.range(0, number), function (i) {
      // indent with margin, start one width length in
      // and add two times width per step
      var position = margin.left + width + i * 2 * width;

      return (
        <rect key={i}
          className="background"
          x={position + "px"}
          y={margin.top}
          height={props.height - margin.bottom - margin.top - margin.top}
          width={width} />
      );
    });
  },

  render: function () {
    var props = this.props;
    var margin = props.margin;
    var height = props.height - (margin.bottom * 1.25) - margin.top;

    return (
      <svg height={props.height} width={props.width}>
        {this.getStripes(4)}
        <g className="bars grid-graph" ref="grid" />
        <g className="y axis" ref="yAxis" />
        <g className="x axis" ref="xAxis"/>
        <g className="y axis">
          <text className="current-value shadow" ref="yAxisCurrent"
            style={{textAnchor: "end"}}
            transform={"translate(" + (props.margin.left - 9) + ",0)"}></text>
        </g>
        {this.getAreaList()}
        <g className="x axis">
          <text className="current-value" ref="xAxisCurrent"
            y={props.margin.bottom}
            transform={"translate(" + props.margin.left + "," + height + ")"}>
            </text>
        </g>
        <line ref="xMousePosition"
          y1={props.margin.top}
          y2={props.height - props.margin.bottom - props.margin.top} />
        <line ref="yMousePosition"
          x1={props.margin.left}
          x2={props.width} />
      </svg>
    );
  }
});

module.exports = TimeSeriesChart;
