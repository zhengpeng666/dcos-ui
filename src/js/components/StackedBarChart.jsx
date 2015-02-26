/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");

var StackedBarChart = React.createClass({

  displayName: "StackedBarChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      maxY: 10,
      ticksY: 10
    };
  },

  getInitialState: function () {
    var props = this.calcSizes(this.props);

    var xScale = this.getXScale(props);
    var yScale = this.getYScale(props);
    return {
      stack: this.getStack(),
      xScale: xScale,
      yScale: yScale
    };
  },

  calcSizes: function (props) {
    var margin = {
      top: 0,
      left: 20,
      bottom: 40,
    };
    var width = props.width;
    var height = Math.round(width / 3 - margin.bottom - margin.top);
    return _.extend(props, {
      width: width,
      height: height,
      margin: margin
    });
  },

  componentDidMount: function () {
    var props = this.calcSizes(this.props);

    this.renderAxis(props, this.state.xScale, this.state.yScale);
    d3.select(this.getDOMNode())
      .append("defs")
        .append("clipPath")
          .attr("id", "clip")
        .append("rect")
          .attr("width", props.width - props.margin.left)
          .attr("height", props.height);
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
      .domain([0, props.maxY])
      .range([props.height, 0]);
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
      .attr("class", "x axis")
      .call(xAxis);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(props.ticksY)
      .tickFormat(this.formatYAxis(props.ticksY, props.maxY))
      .orient("left");
    d3.select(this.refs.yAxis.getDOMNode())
      .call(yAxis);

    d3.select(this.refs.yGrid.getDOMNode())
      .attr("class", "grid y")
      .call(
        d3.svg.axis().scale(yScale)
          .orient("left")
          .ticks(props.ticksY)
          .tickSize(-props.width, 0, 0)
          .tickFormat("")
      );

    d3.select(this.refs.xGrid.getDOMNode())
      .attr("class", "grid x")
      .call(
        d3.svg.axis().scale(xScale)
          .orient("top")
          .ticks(props.ticksY)
          .tickSize(-props.height, 0, 0)
          .tickFormat("")
      );
  },

  componentWillReceiveProps: function (newprops) {
    var props = this.calcSizes(newprops);

    var xScale = this.getXScale(props);
    var yScale = this.getYScale(props);
    // the d3 axis helper requires a <g> element passed into do its work. This
    // happens after mount and ends up keeping the axis code outside of react
    // unfortunately.
    this.renderAxis(props, xScale, yScale);
    this.setState({
      xScale: xScale,
      yScale: yScale
    });
  },

  getBarList: function () {
    var props = this.calcSizes(this.props);
    var width = props.width - props.margin.left;
    var height = props.height;
    var maxY = props.maxY;
    var posY;

    return _.flatten(_.map(this.state.stack(props.data), function (obj, i) {
      var valuesLength = obj.values.length;
      var colorClass = "path-color-" + obj.colorIndex;
      var rectWidth = (width - valuesLength) / valuesLength;

      if (posY == null) {
        posY = _.map(new Array(valuesLength), function () {
          return height;
        });
      }

      return _.map(obj.values, function (val, j) {
        var rectHeight = height * (val.y / maxY);
        var lineClass = colorClass;
        if (rectHeight < 1) {
          rectHeight = 0;
          lineClass += " hidden";
        }
        var posX = props.width - (rectWidth + 1) * (obj.values.length - j + 1);
        posY[j] -= rectHeight;

        /* jshint trailing:false, quotmark:false, newcap:false */
        /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
        return (
          <g className="bar"
              key={i.toString() + j.toString()}
              transform={"translate(" + [posX, 0] + ")"}>
            <line
                className={lineClass}
                x1={0}
                y1={posY[j]}
                x2={rectWidth}
                y2={posY[j]} />
            <rect
                className={colorClass}
                y={posY[j]}
                height={rectHeight}
                width={rectWidth} />
          </g>
        );
        /* jshint trailing:true, quotmark:true, newcap:true */
        /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      });
    }));
  },

  render: function () {
    var props = this.calcSizes(this.props);
    var margin = props.margin;
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <svg height={props.height + margin.bottom}
          width={props.width + margin.left}
          className="barchart">
        <g transform={"translate(" + [margin.left * 2, margin.bottom / 2] + ")"}>
          <g className="x axis"
            transform={"translate(" + [0, props.height] + ")"}
            ref="xAxis"/>
          <g className="y axis" ref="yAxis" />
          <g ref="yGrid" />
          <g ref="xGrid" />
          <g clip-path="url(#clip)">
            {this.getBarList()}
          </g>
        </g>
      </svg>
    );
  }
});

module.exports = StackedBarChart;
