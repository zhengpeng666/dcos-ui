/** @jsx React.DOM */

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
    this.internalStorage_set({width: null});
  },

  componentDidMount: function () {
    this.updateWidth();
    window.addEventListener("focus", this.updateWidth);
    window.addEventListener("resize", this.updateWidth);
  },

  componentWillUnmount: function () {
    window.removeEventListener("focus", this.updateWidth);
    window.removeEventListener("resize", this.updateWidth);
  },

  updateWidth: function () {
    this.internalStorage_set({
      width: DOMUtils.getComputedWidth(this.getDOMNode())
    });
    this.forceUpdate();
  },

  getChildren: function () {
    var data = this.internalStorage_get();
    var width = data.width;
    if (width != null) {
      var calcHeight = this.props.calcHeight;
      var height = width / 2;
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
    return (
      <div>
        {this.getChildren()}
      </div>
    );
  }
});

module.exports = Chart;
