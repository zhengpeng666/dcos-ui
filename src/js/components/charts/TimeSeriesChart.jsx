/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");

var TimeSeriesArea = require("./TimeSeriesArea");
var AnimationCircle = require("./AnimationCircle");

var TimeSeriesChart = React.createClass({

  displayName: "TimeSeriesChart",

  propTypes: {
    // [{name: "Area Name", values: [{date: some time, y: 0}]}]
    data: React.PropTypes.array.isRequired,
    maxY: React.PropTypes.number,
    ticksY: React.PropTypes.number,
    y: React.PropTypes.string,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      maxY: 10,
      ticksY: 3,
      y: "y",
      margin: {
        top: 10,
        left: 45,
        bottom: 25,
        right: 4
      }
    };
  },

  getInitialState: function () {
    var xScale = this.getXScale(this.props);
    var yScale = this.getYScale(this.props);

    return {
      area: this.getArea(xScale, yScale),
      stack: this.getStack(),
      xScale: xScale,
      yScale: yScale
    };
  },

  componentDidMount: function () {
    var props = this.props;
    var margin = props.margin;
    this.renderAxis(props, this.state.xScale, this.state.yScale);

    // create clip path for areas and x-axis
    d3.select(this.getDOMNode())
      .append("defs")
        .append("clipPath")
          .attr("id", "clip")
        .append("rect")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")"
          )
          .attr("width", props.width - margin.right - margin.left)
          // includes x-axis as we want to clip that as well
          .attr("height", props.height - margin.top);
  },

  getArea: function (xScale, yScale) {
    var y = this.props.y;
    return d3.svg.area()
      .x(function (d) { return xScale(d.date); })
      .y0(function (d) { return yScale(d.y0); })
      .y1(function (d) { return yScale(d.y0 + d[y]); })
      .interpolate("monotone");
  },

  getStack: function () {
    return d3.layout.stack()
      .values(function (d) { return d.values; })
      .x(function (d) { return d.date; });
  },

  getXScale: function (props) {
    var date = Date.now();
    var dateDelta = Date.now();

    var firstDataSet = _.first(props.data);
    if (firstDataSet != null) {
      var values = firstDataSet.values;
      // [first date - 1, last date - 1]
      // ristrict x domain to have extra point outside of graph area,
      // since we are animating the graph in from right
      date = values[1].date;
      dateDelta = values[values.length - 3].date;
    }

    return d3.time.scale()
      .range([0, props.width])
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
    var formatPercent = d3.scale.linear().tickFormat(ticks, ".0%");
    return function (d) {
      var a = formatPercent(d / maxY);
      if (d >= maxY) {
        a = "100%";
      }
      return a;
    };
  },

  renderAxis: function (props, xScale, yScale) {
    var margin = props.margin;
    var length = props.width;
    var firstDataSet = _.first(props.data);
    if (firstDataSet != null) {
      length = firstDataSet.values.length;
    }

    var xAxis = d3.svg.axis()
      .ticks(d3.time.second, length)
      .scale(xScale)
      .orient("bottom");
      var h = props.height - margin.bottom  - margin.top;
    d3.select(this.refs.xAxis.getDOMNode())
      .attr("transform", "translate(" + margin.left + "," + h + ")")
      .call(xAxis);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(props.ticksY)
      .tickFormat(this.formatYAxis(props.ticksY, props.maxY))
      .orient("left");
    d3.select(this.refs.yAxis.getDOMNode())
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(yAxis);

    d3.select(this.refs.grid.getDOMNode())
      .attr("class", "grid")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(
        d3.svg.axis().scale(yScale)
          .orient("left")
          .ticks(props.ticksY)
          .tickSize(-props.width + margin.left + margin.right, 0, 0)
          .tickFormat("")
      );
  },

  componentWillReceiveProps: function (props) {

    var xScale = this.getXScale(props);
    var yScale = this.getYScale(props);
    // the d3 axis helper requires a <g> element passed into do its work. This
    // happens after mount and ends up keeping the axis code outside of react
    // unfortunately.
    this.renderAxis(props, xScale, yScale);
    this.setState({
      area: this.getArea(xScale, yScale),
      xScale: xScale,
      yScale: yScale
    });
  },

  getTransitionTime: function (data) {
    // look at the difference between the last and the third last point
    // to calculate transition time
    var l = data.length - 1;
    return (data[l].date - data[l - 3].date) / 3;
  },

  getPosition: function (data) {
    var firstDataSet = _.first(data);
    var date = Date.now();
    if (firstDataSet != null) {
      date = firstDataSet.date;
    }
    return this.state.xScale(date);
  },

  getCirclePosition: function (obj) {
    var props = this.props;
    var lastestVisibleDataPoint = obj.values[obj.values.length - 2];
    // [stay in x-value, most recent y - height of chart]
    return [
      0,
      this.state.yScale(lastestVisibleDataPoint[props.y]) -
      props.height + props.margin.top + props.margin.bottom
    ];
  },

  getAreaList: function () {
    var props = this.props;
    // stack before drawing!
    return _.map(this.state.stack(props.data), function (obj, i) {
      var classes = {
        "area": true
      };
      classes["path-color-" + obj.colorIndex] = true;

      var transitionTime =
        this.getTransitionTime(obj.values, this.state.xScale);
      // y0 of lastest visible obj + account for stroke size
      var initialPosition =
        this.state.yScale(obj.values[obj.values.length - 2].y0);

      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <g className={React.addons.classSet(classes)} key={i}>
          <AnimationCircle
            transitionTime={transitionTime}
            position={this.getCirclePosition(obj)}
            cx={props.width - props.margin.right}
            cy={initialPosition} />
          <g clip-path="url(#clip)">
            <TimeSeriesArea
              path={this.state.area(obj.values)}
              name={obj.name}
              transitionTime={transitionTime}
              position={this.getPosition(obj.values)} />
          </g>
        </g>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
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
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <rect key={i}
          className="background"
          x={position + "px"}
          y={margin.top}
          height={props.height - margin.bottom - margin.top  - margin.top}
          width={width} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    var ReactTransitionGroup = React.addons.TransitionGroup;
    var props = this.props;
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <svg height={props.height} width={props.width}>
        {this.getStripes(4)}
        <g className="bars" ref="grid" />
        <g clip-path="url(#clip)">
          <g className="x axis" ref="xAxis"/>
        </g>
        <g className="y axis" ref="yAxis" />
        <ReactTransitionGroup component="g">
          {this.getAreaList()}
        </ReactTransitionGroup>
      </svg>
    );
  }
});

module.exports = TimeSeriesChart;
