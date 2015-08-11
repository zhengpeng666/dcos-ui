var _ = require("underscore");
var React = require("react/addons");

var InternalStorageMixin = require("../../mixins/InternalStorageMixin");
var DOMUtils = require("../../utils/DOMUtils");

var Chart = React.createClass({

  displayName: "Chart",

  mixins: [InternalStorageMixin],

  propTypes: {
    calcHeight: React.PropTypes.func
  },

  componentWillMount: function () {
    this.updateWidth = _.throttle(this.updateWidth, 500);
    this.internalStorage_set({width: null});
  },

  componentDidMount: function () {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth);
  },

  componentWillUnmount: function () {
    window.removeEventListener("resize", this.updateWidth);
  },

  updateWidth: function () {
    var dimensions = DOMUtils.getComputedDimensions(this.getDOMNode());
    var data = this.internalStorage_get();

    if (data.width !== dimensions.width || data.height !== dimensions.height) {
      this.internalStorage_set(dimensions);
      this.forceUpdate();
    }
  },

  getChildren: function () {
    var data = this.internalStorage_get();
    var width = data.width;
    var height = data.height;
    if (width != null) {
      var calcHeight = this.props.calcHeight;

      if (_.isFunction(calcHeight)) {
        height = calcHeight(width);
      }

      var children = this.props.children;
      if (_.isArray(children)) {
        height = height / children.length;
        return _.map(children, function (child) {
          return React.addons.cloneWithProps(
            child,
            {width: width, height: height}
          );
        });
      } else {
        return React.addons.cloneWithProps(
          children,
          {width: width, height: height}
        );
      }
    }
  },

  render: function () {
    // at the moment, 'chart' is used to inject the chart colour palette.
    // we should reclaim it as the rightful className of <Chart />
    return (
      <div className="chart-chart">
        {this.getChildren()}
      </div>
    );
  }
});

module.exports = Chart;
