/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");

var TimeSeriesArea = require("./TimeSeriesArea");

var StackedBarChart = React.createClass({

  displayName: "StackedBarChart",

  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      height: 0,
      width: 0,
      formatXAxis: _.noop,
      formatYAxis: _.noop
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
    this.renderAxis(this.props, this.state.xScale, this.state.yScale);
    d3.select(this.getDOMNode())
      .append("defs")
        .append("clipPath")
          .attr("id", "clip")
        .append("rect")
          .attr("width", this.props.width - this.props.margin.left)
          .attr("height", this.props.height);
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
    var firstDataSet = _.first(props.data).values;
    return d3.time.scale().range([0, props.width])
      // [first date, last date - 1]
      // restrict x domain to have extra point outside of graph area,
      // since we are animating the graph in from right
      .domain([
        firstDataSet[1].date, firstDataSet[firstDataSet.length - 2].date
      ]);
  },

  getYScale: function (props) {
    return d3.scale.linear().range([props.height, 0])
      .domain([props.minY, props.maxY]).nice();
  },

  customAxis: function (g) {
    g.selectAll("g.y.axis text")
      .attr("x", -40)
      .attr("dy", 5);
  },

  renderAxis: function (props, xScale, yScale) {
    var xAxis = d3.svg.axis()
      .ticks(d3.time.second, _.first(props.data).values.length)
      .scale(xScale)
      .tickFormat(this.props.formatXAxis())
      .orient("bottom");
    d3.select(this.refs.xAxis.getDOMNode())
      .attr("class", "x axis")
      .call(xAxis);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(2)
      .tickSize(this.props.width)
      .tickFormat(this.props.formatYAxis())
      .orient("right");
    d3.select(this.refs.yAxis.getDOMNode())
      .call(yAxis)
      .call(this.customAxis);
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
    return this.state.xScale(_.first(data).date);
  },

  getAreaList: function () {
    var firstDataSet = _.first(this.props.data);
    var transition = this.getTransitionTime(firstDataSet.values);
    var position = this.getPosition(firstDataSet.values);

    var classes;
    // stack before drawing!
    return _.map(this.state.stack(this.props.data), function (obj, i) {
      classes = {
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
            transitionTime={transition}
            position={position} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }, this);
  },

  getStripes: function (number) {
    var props = this.props;
    var width = (props.width - props.margin.left) / (2 * number);
    return _.map(_.range(0, number), function (i) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <rect key={i}
            className="background"
            x={width + 2 * i * width + "px"}
            height={props.height}
            width={width}>
        </rect>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    var margin = this.props.margin;
    return (
      <svg height={this.props.height + margin.bottom} width={this.props.width + margin.left}>
        <g transform={"translate(" + [margin.left * 2, margin.bottom / 2] + ")"}>
          {this.getStripes(4)}
        </g>
      </svg>
    );
  }
});

module.exports = StackedBarChart;
