/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

function getComputedWidth(obj) {
  var compstyle;
  if (typeof window.getComputedStyle === "undefined") {
    compstyle = obj.currentStyle;
  } else {
    compstyle = window.getComputedStyle(obj);
  }
  return _.foldl(
    ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"],
    function (acc, key) {
      var val = parseInt(compstyle[key], 10);
    if (_.isNaN(val)) {
      return acc;
    } else {
      return acc - val;
    }
  }, obj.offsetWidth);
}

var Chart = React.createClass({

  displayName: "Chart",

  propTypes: {
    calcHeight: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      width: null
    };
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
    this.setState({
      width: getComputedWidth(this.getDOMNode())
    });
  },

  getChildren: function () {
    var width = this.state.width;
    if (width != null) {
      var calcHeight = this.props.calcHeight;
      var height = width / 2;
      if (_.isFunction(calcHeight)) {
        height = calcHeight(width);
      }

      var children = this.props.children;
      if (_.isArray(children)) {
        return _.map(children, function (child) {
          React.addons.cloneWithProps(
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

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div>
        {this.getChildren()}
      </div>
    );
  }
});

module.exports = Chart;
