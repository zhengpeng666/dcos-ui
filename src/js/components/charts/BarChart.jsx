/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");

var Bar = require("./Bar");

var BarChart = React.createClass({

  displayName: "BarChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    peakline: React.PropTypes.bool,
    y: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      margin: {
        top: 0,
        left: 40,
        bottom: 40,
      },
      peakline: false,
      maxY: 10,
      ticksY: 10,
      y: "y"
    };
  },

  getInitialState: function () {
    var props = this.props;

    var xScale = this.getXScale(props);
    var yScale = this.getYScale(props);
    return {
      stack: this.getStack(),
      stackedData: [],
      rectWidth: 0,
      valuesLength: 0,
      xScale: xScale,
      yScale: yScale
    };
  },

  componentDidMount: function () {
    var props = this.props;

    this.renderAxis(props, this.state.xScale, this.state.yScale);
    d3.select(this.refs.barchart.getDOMNode())
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

  componentWillReceiveProps: function (props) {
    var xScale = this.getXScale(props);
    var yScale = this.getYScale(props);
    // the d3 axis helper requires a <g> element passed into do its work. This
    // happens after mount and ends up keeping the axis code outside of react
    // unfortunately.
    this.renderAxis(props, xScale, yScale);

    var stackedData = this.state.stack(props.data);
    var valuesLength = 0;
    var rectWidth = 0;

    if (stackedData.length !== 0) {
      valuesLength = _.last(stackedData).values.length;
      rectWidth = (props.width - props.margin.left) / valuesLength;
    }

    var state = {
      valuesLength: valuesLength,
      rectWidth: rectWidth,
      stackedData: stackedData
    };

    this.setState(_.extend(state, {
      xScale: xScale,
      yScale: yScale
    }));
  },

  getBarList: function () {
    var props = this.props;
    var state = this.state;
    var marginLeft = props.margin.left;
    var chartWidth = props.width;
    var y = props.y;
    var valuesLength = state.valuesLength;
    var posY = _.map(_.range(valuesLength), function () {
      return props.height;
    });
    var peaklineHeight = 2;
    var lineClass;
    if (!props.peakline) {
      peaklineHeight = 0;
      lineClass = "hidden ";
    }

    return _.map(state.stackedData, function (framework) {
      var colorClass = "path-color-" + framework.colorIndex;
      var rectWidth = (chartWidth - marginLeft) / valuesLength;

      return _.map(framework.values, function (val, j) {
        var rectHeight = props.height * val[y] / props.maxY - peaklineHeight;

        var posX = chartWidth - marginLeft - rectWidth * (valuesLength - j);
        posY[j] -= rectHeight;

        /* jshint trailing:false, quotmark:false, newcap:false */
        /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
        return (
          <Bar
            posX={posX}
            posY={posY[j]}
            rectHeight={rectHeight}
            rectWidth={rectWidth}
            colorClass={colorClass}
            lineClass={lineClass + colorClass} />
        );
        /* jshint trailing:true, quotmark:true, newcap:true */
        /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      });
    });
  },

  render: function () {
    var props = this.props;
    var margin = props.margin;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <svg height={props.height + margin.bottom}
          width={props.width}
          className="barchart"
          ref="barchart">
        <g transform={"translate(" + [margin.left, margin.bottom / 2] + ")"}>
          <g className="y axis" ref="yAxis" />
          <g className="x axis"
            transform={"translate(" + [0, props.height] + ")"}
            ref="xAxis"/>
          <g ref="yGrid" />
          <g ref="xGrid" />
          {this.getBarList()}
        </g>
      </svg>
    );
  }
});

module.exports = BarChart;
