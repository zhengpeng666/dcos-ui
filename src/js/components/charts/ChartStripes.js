/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var ChartStripes = React.createClass({

  displayName: "ChartStripes",

  propTypes: {
    count: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    margin: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired
  },

  getStripes: function (props) {
    var count = props.count;
    var margin = props.margin;
    var width = (props.width - margin.left - margin.right) / (2 * count);
    return _.map(_.range(0, count), function (i) {
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
    return (
      <g>
        {this.getStripes(this.props)}
      </g>
    );
  }
});

module.exports = ChartStripes;
