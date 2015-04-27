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
    refreshRate: React.PropTypes.number.isRequired,
    strokeOffset: React.PropTypes.number
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
      refreshRate: 0,
      strokeOffset: 2
    };
  },

  componentWillMount: function () {
    var xScale = this.getXScale(this.props);
    var xTimeScale = this.getXTimeScale(this.props);
    var yScale = this.getYScale(this.props);

    var data = {
      clipPathID: _.uniqueId("clip"),
      area: this.getArea(xTimeScale, yScale),
      stack: this.getStack(),
      xScale: xScale,
      xTimeScale: xTimeScale,
      yScale: yScale
    };

    this.internalStorage_set(data);
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
    if (this.props.yFormat === ValueTypes.PERCENTAGE) {
      var formatPercent = d3.scale.linear().tickFormat(ticks, ".0%");

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

  getBoundingBox: function (props) {
    var el = this.getDOMNode();
    var elPosition = el.getBoundingClientRect();

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
    var data = this.internalStorage_get();
    var props = this.props;
    var margin = props.margin;
    var yCaption = "";
    if (props.yFormat === ValueTypes.PERCENTAGE) {
      yCaption = "%";
    }

    return (
      <svg height={props.height} width={props.width}>
        <ChartStripes
          count={4}
          height={props.height}
          margin={props.margin}
          width={props.width} />
        <g className="bars grid-graph" ref="grid" />
        <g className="y axis" ref="yAxis" />
        <g className="x axis" ref="xAxis" />
        {this.getAreaList()}
        <TimeSeriesMouseOver
          addMouseHandler={this.addMouseHandler}
          data={props.data}
          getBoundingBox={this.getBoundingBox.bind(null, props)}
          height={props.height}
          margin={props.margin}
          width={props.width}
          xScale={data.xScale}
          y={props.y}
          yCaption={yCaption}
          yScale={data.yScale}
          removeMouseHandler={this.removeMouseHandler} />
      </svg>
    );
  }
});

module.exports = TimeSeriesChart;
