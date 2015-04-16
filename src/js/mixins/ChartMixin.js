var _ = require("underscore");
var d3 = require("d3");

var ChartMixin = {

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

  formatXAxis: function (d) {
    if (parseInt(Math.abs(d)) > 0) {
      return d + "s";
    } else {
      return d;
    }
  }

};

module.exports = ChartMixin;
