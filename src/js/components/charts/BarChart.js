/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");

var Bar = require("./Bar");
var InternalStorageMixin = require("../../mixins/InternalStorageMixin");

var BarChart = React.createClass({

  displayName: "BarChart",

  mixins: [InternalStorageMixin],

  propTypes: {
    data: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    peakline: React.PropTypes.bool,
    y: React.PropTypes.string,
    refreshRate: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      margin: {
        top: 0,
        right: 5,
        bottom: 40,
        left: 43
      },
      peakline: false,
      maxY: 10,
      ticksY: 10,
      y: "y",
      transition: {
        delay: 200,
        duration: 800
      },
      refreshRate: 0
    };
  },

  componentWillMount: function () {
    var props = this.props;

    var xScale = this.getXScale(props);
    var yScale = this.getYScale(props);

    var data = {
      stack: this.getStack(),
      xScale: xScale,
      yScale: yScale,
      clipPathID: _.uniqueId("clip")
    };

    this.internalStorage_set(data);

    // #prepareValues needs data.stack, so we must set that first
    this.internalStorage_update(this.prepareValues(this.props));
  },

  componentDidMount: function () {
    var data = this.internalStorage_get();
    var props = this.props;

    this.renderAxis(props, data.xScale, data.yScale);
    this.createClipPath();
    this.resetXAxis(props);
  },

  componentWillReceiveProps: function (props) {
    var xScale = this.getXScale(props);
    var yScale = this.getYScale(props);
    // the d3 axis helper requires a <g> element passed into do its work. This
    // happens after mount and ends up keeping the axis code outside of react
    // unfortunately.
    this.renderAxis(props, xScale, yScale);

    this.internalStorage_update(_.extend(this.prepareValues(props), {
      xScale: xScale,
      yScale: yScale
    }));

    this.resetXAxis(props);
  },

  componentDidUpdate: function () {
    this.updateClipPath();
  },

  createClipPath: function () {
    var data = this.internalStorage_get();
    var el = this.getDOMNode();

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
    var width = props.width - props.margin.left - props.margin.right;
    var height = props.height + 1;  // +1 for the base axis line

    d3.select("#" + data.clipPathID + " rect")
      .attr({
        width: width,
        height: height
      });
  },

  getStack: function () {
    return d3.layout.stack()
      .values(function (d) { return d.values; })
      .x(function (d) { return d.date; });
  },

  getXScale: function (props) {
    var length = props.width;
    var firstDataSet = _.first(props.data);
    if (firstDataSet != null) {
      length = firstDataSet.values.length;
    }

    var timeAgo = -(length - 1) * (props.refreshRate / 1000);
    return d3.scale.linear()
      .range([0, props.width - props.margin.left - props.margin.right])
      .domain([timeAgo, 0]);
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

    // The 4 is a number that works, though random :)
    if (firstDataSet) {
      var xTicks = length / (props.refreshRate / 1000) / 4;
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(xTicks)
        .orient("bottom");
      d3.select(this.refs.xAxis.getDOMNode()).interrupt()
        .attr("class", "x axis")
        .call(xAxis);
    }

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

  prepareValues: function (props) {
    var data = this.internalStorage_get();
    var stackedData = data.stack(props.data);
    var valuesLength = 0;
    var rectWidth = 0;

    if (stackedData.length !== 0) {
      valuesLength = _.last(stackedData).values.length;
      rectWidth = (props.width - props.margin.left - props.margin.right) / valuesLength;
    }

    return {
      valuesLength: valuesLength,
      rectWidth: rectWidth,
      stackedData: stackedData
    };
  },

  resetXAxis: function (props) {
    var data = this.internalStorage_get();
    // here we reset the position of the axis to what it was before the animation started
    // the axis is reset right before we update the bar to the new value/position
    // prevents subsequent animations from animating from 0
    if (data.rectWidth) {
      d3.select(this.refs.xAxis.getDOMNode()).interrupt()
        .transition().delay(0)
        .attr("transform", "translate(" + [0, props.height] + ")");
    }
  },

  getBarList: function () {
    var data = this.internalStorage_get();
    var props = this.props;
    var marginLeft = props.margin.left;
    var marginRight = props.margin.right;
    var chartWidth = props.width;
    var y = props.y;
    var valuesLength = data.valuesLength;
    var posY = _.map(_.range(valuesLength), function () {
      return props.height;
    });
    var peaklineHeight = 2;
    var lineClass;
    if (!props.peakline) {
      peaklineHeight = 0;
      lineClass = "hidden ";
    }

    return _.map(data.stackedData, function (framework) {
      var colorClass = "path-color-" + framework.colorIndex;
      var rectWidth = (chartWidth - marginLeft - marginRight) / (valuesLength - 1);

      return _.map(framework.values, function (val, j) {
        var rectHeight = props.height * val[y] / props.maxY - peaklineHeight;

        var posX = chartWidth - marginLeft - marginRight - rectWidth * (valuesLength - 1 - j);
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
            transitionDelay={props.transition.delay}
            transitionDuration={props.transition.duration}
            lineClass={lineClass + colorClass} />
        );
        /* jshint trailing:true, quotmark:true, newcap:true */
        /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      });
    });
  },

  render: function () {
    var data = this.internalStorage_get();
    var props = this.props;
    var margin = props.margin;
    var clipPath = "url(#" + data.clipPathID + ")";

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
          <g className="grid-graph" clip-path={clipPath}>
            <g ref="yGrid" />
            <g ref="xGrid" />
            {this.getBarList()}
          </g>
        </g>
      </svg>
    );
  }
});

module.exports = BarChart;
