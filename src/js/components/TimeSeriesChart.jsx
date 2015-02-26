/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");

var TimeSeriesArea = require("./TimeSeriesArea");

var TimeSeriesChart = React.createClass({

  displayName: "TimeSeriesChart",

  propTypes: {
    // [{name: "Area Name", values: [{date: some time, y: 0}]}]
    data: React.PropTypes.array.isRequired,
    maxY: React.PropTypes.number,
    ticksY: React.PropTypes.number,
    width: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      maxY: 10,
      ticksY: 10
    };
  },

  calcSizes: function (props) {
    var margin = {
      top: 10,
      left: 45,
      bottom: 45,
    };
    var width = Math.round(props.width - margin.left);
    var height = Math.round(width / 2 - margin.bottom - margin.top);
    return _.extend(props, {
      width: width,
      height: height,
      margin: margin
    });
  },

  getInitialState: function () {
    var props = this.calcSizes(this.props);

    var xScale = this.getXScale(props);
    var yScale = this.getYScale(props);

    return {
      area: this.getArea(xScale, yScale),
      stack: this.getStack(),
      xScale: xScale,
      yScale: yScale
    };
  },

  componentDidMount: function () {
    var props = this.calcSizes(this.props);
    this.renderAxis(props, this.state.xScale, this.state.yScale);

    // create clip path for areas and x-axis
    d3.select(this.getDOMNode())
      .append("defs")
        .append("clipPath")
          .attr("id", "clip")
        .append("rect")
          .attr("transform",
            "translate(" + props.margin.left + "," + props.margin.top + ")"
          )
          .attr("width", props.width + props.margin.left)
          .attr("height",
            props.height + props.margin.top + props.margin.bottom
          );
  },

  getArea: function (xScale, yScale) {
    return d3.svg.area()
      .x(function (d) { return xScale(d.date); })
      .y0(function (d) { return yScale(d.y0); })
      .y1(function (d) { return yScale(d.y0 + d.y); })
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
      dateDelta = values[values.length - 2].date;
    }

    return d3.time.scale()
      .range([0, props.width])
      .domain([date, dateDelta]);
  },

  getYScale: function (props) {
    return d3.scale.linear()
      // give a little space in the top for the number
      .range([props.height, props.margin.top])
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
    var length = props.width;
    var firstDataSet = _.first(props.data);
    if (firstDataSet != null) {
      length = firstDataSet.values.length;
    }

    var xAxis = d3.svg.axis()
      .ticks(d3.time.second, length)
      .scale(xScale)
      .orient("bottom");

    d3.select(this.refs.xAxis.getDOMNode())
      .attr("transform", "translate(0," + props.height + ")")
      .call(xAxis);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(props.ticksY)
      .tickFormat(this.formatYAxis(props.ticksY, props.maxY))
      .orient("left");
    d3.select(this.refs.yAxis.getDOMNode())
      .attr("transform", "translate(" + props.margin.left + ",0)")
      .call(yAxis);

    d3.select(this.refs.grid.getDOMNode())
      .attr("class", "grid")
      .attr("transform", "translate(" + props.margin.left + ",0)")
      .call(
        d3.svg.axis().scale(yScale)
          .orient("left")
          .ticks(props.ticksY)
          .tickSize(props.margin.left - props.width, 0, 0)
          .tickFormat("")
      );
  },

  componentWillReceiveProps: function (nextProps) {
    var props = this.calcSizes(nextProps);

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

  getAreaList: function () {
    // stack before drawing!
    return _.map(this.state.stack(this.props.data), function (obj, i) {
      var classes = {
        "area": true
      };
      classes["path-color-" + obj.colorIndex] = true;
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <TimeSeriesArea
          className={React.addons.classSet(classes)}
          path={this.state.area(obj.values)}
          key={i}
          name={obj.name}
          transitionTime={this.getTransitionTime(obj.values, this.state.xScale)}
          position={this.getPosition(obj.values)} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }, this);
  },

  getStripes: function (number, props) {
    var width = Math.round(props.width / (2 * number));
    return _.map(_.range(0, number), function (i) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <rect key={i}
          className="background"
          x={props.margin.left + width + 2 * i * width + "px"}
          y={props.margin.top}
          height={props.height + props.margin.top}
          width={width} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    var ReactTransitionGroup = React.addons.TransitionGroup;
    var props = this.calcSizes(this.props);

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <svg height={props.height + props.margin.bottom} width={props.width + props.margin.left}>
          {this.getStripes(4, props)}
          <g className="bars" ref="grid" />
          <g clip-path="url(#clip)">
            <ReactTransitionGroup component="g">
              {this.getAreaList()}
            </ReactTransitionGroup>
          <g className="x axis" ref="xAxis"/>
          </g>
          <g className="y axis" ref="yAxis" />
      </svg>
    );
  }
});

module.exports = TimeSeriesChart;
