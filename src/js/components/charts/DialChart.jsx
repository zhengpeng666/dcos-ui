/** @jsx React.DOM */

var _ = require("underscore");
var d3 = require("d3");
var React = require("react/addons");

var Chart = require("./Chart");
var DialSlice = require("./DialSlice");

var DialChart = React.createClass({

  displayName: "DialChart",

  propTypes: {
    // [{colorIndex: 0, name: "Some Name", value: 4}]
    data: React.PropTypes.array.isRequired,
    value: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      value: "value"
    };
  },

  getInitialState: function() {
    var value = this.props.value;
    return _.extend({
      pie: d3.layout.pie()
        .sort(null)
        .value(function(d) { return d[value]; })
    }, this.getArcs(this.props));
  },

  getSlice: function(props) {
    return d3.select(this.getDOMNode()).selectAll("path")
      .data(this.state.pie(props.data), this.key);
  },

  shouldComponentUpdate: function (nextProps) {

    var slice = this.getSlice(this.props);
    var arc = this.state.innerArc;

    slice.each(function(d) { this._current = d; });

    slice = this.getSlice(nextProps);
    slice.transition()
      .duration(1000)
      .attrTween("d", function(d) {
        var interpolate = d3.interpolate(this._current, d);
        var _this = this;
        return function(t) {
          _this._current = interpolate(t);
          return arc(_this._current);
        };
      });

    slice.exit().transition()
      .delay(this.state.duration)
      .duration(0)
      .remove();

    return true;
  },

  getArcs: function(props) {
    var radius = props.size / 2;
    return {
      innerArc: d3.svg.arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.5),
      outerArc: d3.svg.arc()
        .outerRadius(radius * 1)
        .innerRadius(radius * 1),
      innerRadius: radius * 0.5
    };
  },

  getPosition: function() {
    return "translate(" +
      this.props.coords.x + "," + this.props.coords.y + ")";
  },

  getWedges: function () {
    var innerArc = this.state.innerArc;
    var pie = this.state.pie;
    return _.map(pie(this.props.data), function (data, i) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <DialSlice
          key={i}
          colorIndex={i}
          path={innerArc(data)} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function() {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Chart calcHeight={function (w) { return w/2; }}>
        <svg height={this.props.height} width={this.props.width}>
          <g transform={this.getPosition()}
              onMouseOver={this.showTooltip}
              onMouseOut={this.hideTooltip}>
            <g className="slices">
              {this.getWedges()}
            </g>
          </g>
        </svg>
      </Chart>
    );
  }

});

module.exports = DialChart;
