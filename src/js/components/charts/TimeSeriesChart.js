/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");

var AnimationCircle = require("./AnimationCircle");
var ChartMixin = require("../../mixins/ChartMixin");
var ChartStripes = require("./ChartStripes");
var InternalStorageMixin = require("../../mixins/InternalStorageMixin");
var Maths = require("../../utils/Maths");
var TimeSeriesArea = require("./TimeSeriesArea");
var TimeSeriesMouseOver = require("./TimeSeriesMouseOver");
var ValueTypes = require("../../constants/ValueTypes");

var TimeSeriesChart = React.createClass({

  displayName: "TimeSeriesChart",

  propTypes: {
    // [{name: "Area Name", values: [{date: some time, y: 0}]}]
    data: React.PropTypes.array.isRequired,
    maxY: React.PropTypes.number,
    ticksY: React.PropTypes.number,
    y: React.PropTypes.string,
    yFormat: React.PropTypes.string,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    margin: React.PropTypes.object.isRequired,
    refreshRate: React.PropTypes.number.isRequired
  },

  mixins: [ChartMixin, InternalStorageMixin],

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
      refreshRate: 0
    };
  },

  componentWillMount: function () {
    var xScale = this.getXScale(this.props);
    var xTimeScale = this.getXTimeScale(this.props);
    var yScale = this.getYScale(this.props);

    this.internalStorage_set({
      clipPathID: _.uniqueId("clip"),
      area: this.getArea(xTimeScale, yScale),
      xScale: xScale,
      xTimeScale: xTimeScale,
      yScale: yScale,
      valueLine: this.getValueLine(xTimeScale, yScale)
    });
  },

  componentDidMount: function () {
    var data = this.internalStorage_get();
    var props = this.props;

    this.renderAxis(props, data.xScale, data.yScale);
    this.createClipPath();
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

    d3.select("#" + data.clipPathID + " rect")
      .attr({
        width: this.getWidth(this.props),
        height: this.getHeight(this.props)
      });
  },

  getArea: function (xTimeScale, yScale) {
    var y = this.props.y;

    return d3.svg.area()
      .x(function (d) { return xTimeScale(d.date); })
      .y0(function () { return yScale(0); })
      .y1(function (d) { return yScale(d[y]); })
      .interpolate("monotone");
  },

  getValueLine: function (xTimeScale, yScale) {
    var y = this.props.y;

    return d3.svg.line()
      .x(function (d) { return xTimeScale(d.date); })
      .y(function (d) { return yScale(d[y]); })
      .interpolate("monotone");
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
      // [first date, last date - 1]
      // Ristrict x domain to have one extra point outside of graph area,
      // since we are animating the graph in from right
      date = _.first(values).date;
      dateDelta = values[values.length - 2].date;
    }

    return d3.time.scale()
      .range([0, this.getWidth(props)])
      .domain([date, dateDelta]);
  },

  getYScale: function (props) {
    return d3.scale.linear()
      // give a little space in the top for the number
      .range([this.getHeight(props), 0])
      .domain([0, props.maxY]);
  },

  getYCaption: function () {
    if (this.props.yFormat === ValueTypes.PERCENTAGE) {
      return "%";
    }
    return "";
  },

  formatYAxis: function (ticks, maxY) {
    if (this.props.yFormat === ValueTypes.PERCENTAGE) {
      var formatPercent = d3.scale.linear().tickFormat(
        ticks,
        ".0" + this.getYCaption()
      );

      return function (d) {
        if (d >= maxY) {
          return "100%";
        }

        return formatPercent(d / maxY);
      };
    }

    return function (d) {
      if (d >= maxY) {
        return maxY;
      }

      return d;
    };
  },

  renderAxis: function (props, xScale, yScale) {
    var firstDataSet = _.first(props.data);

    if (firstDataSet != null) {
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickValues(this.getXTickValues(xScale))
        .tickFormat(this.formatXAxis)
        .orient("bottom");
      d3.select(this.refs.xAxis.getDOMNode()).interrupt()
        .attr("transform", "translate(0," + this.getHeight(props) + ")")
        .call(xAxis);
    }

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(props.ticksY)
      .tickFormat(this.formatYAxis(props.ticksY, props.maxY))
      .orient("left");
    d3.select(this.refs.yAxis.getDOMNode())
      .call(yAxis);

    d3.select(this.refs.grid.getDOMNode())
      .call(
        d3.svg.axis().scale(yScale)
          .orient("left")
          .ticks(props.ticksY)
          .tickSize(-this.getWidth(props), 0, 0)
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
      valueLine: this.getValueLine(xTimeScale, yScale),
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

  getNewXPosition: function (values, transitionTime) {
    var data = this.internalStorage_get();
    var firstDataSet = _.first(values);
    var date = Date.now();

    if (firstDataSet != null) {
      date = firstDataSet.date;
    }

    // add transition time since we are moving towards new pos
    return data.xTimeScale(date + transitionTime);
  },

  getNewYPosition: function (obj, props) {
    var data = this.internalStorage_get();
    var lastestDataPoint = _.last(obj.values);

    // most recent y - height of chart
    return data.yScale(lastestDataPoint[props.y]) - this.getHeight(props);
  },

  getAreaList: function (store, data) {
    return _.map(data, function (obj, i) {
      var transitionTime = this.getTransitionTime(obj.values);

      return (
        <TimeSeriesArea
          className={"path-color-" + obj.colorIndex}
          key={i}
          line={store.valueLine(obj.values)}
          path={store.area(obj.values)}
          position={[-this.getNewXPosition(obj.values, transitionTime), 0]}
          transitionTime={transitionTime} />
      );
    }, this);
  },

  getCircleList: function () {
    var props = this.props;

    return _.map(props.data, function (obj, i) {
      var transitionTime = this.getTransitionTime(obj.values);

      return (
        <AnimationCircle
          className={"arc path-color-" + obj.colorIndex}
          cx={this.getWidth(props)}
          cy={this.getHeight(props)}
          key={i}
          position={[0, this.getNewYPosition(obj, props)]}
          transitionTime={transitionTime} />
      );
    }, this);
  },

  getBoundingBox: function () {
    var el = this.getDOMNode();
    var elPosition = el.getBoundingClientRect();

    var props = this.props;
    var margin = props.margin;

    return {
      top: elPosition.top + margin.top,
      right: elPosition.left + props.width - margin.right,
      bottom: elPosition.top + props.height - margin.bottom,
      left: elPosition.left + margin.left
    };
  },

  addMouseHandler: function (handleMouseMove, handleMouseOut) {
    var el = this.getDOMNode();
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseout", handleMouseOut);
  },

  removeMouseHandler: function (handleMouseMove, handleMouseOut) {
    var el = this.getDOMNode();
    el.removeEventListener("mousemove", handleMouseMove);
    el.removeEventListener("mouseout", handleMouseOut);
  },

  render: function () {
    var store = this.internalStorage_get();
    var props = this.props;
    var margin = props.margin;
    var height = this.getHeight(props);
    var width = this.getWidth(props);
    var clipPath = "url(#" + store.clipPathID + ")";

    return (
      <svg height={props.height} width={props.width}>
        <g transform={"translate(" + margin.left + "," + margin.top + ")"}>
          <ChartStripes
            count={4}
            height={height}
            width={width} />
          <g clip-path={clipPath}>
            {this.getAreaList(store, props.data)}
          </g>
          <g className="bars grid-graph" ref="grid" />
          <g className="y axis" ref="yAxis" />
          <g className="x axis" ref="xAxis" />
          <TimeSeriesMouseOver
            addMouseHandler={this.addMouseHandler}
            data={props.data}
            getBoundingBox={this.getBoundingBox}
            height={height}
            removeMouseHandler={this.removeMouseHandler}
            width={width}
            xScale={store.xScale}
            y={props.y}
            yCaption={this.getYCaption()}
            yScale={store.yScale} />
          {this.getCircleList()}
        </g>
      </svg>
    );
  }
});

module.exports = TimeSeriesChart;
