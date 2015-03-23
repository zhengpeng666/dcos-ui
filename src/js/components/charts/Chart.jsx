/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var DOMUtils = require("../../utils/DOMUtils");

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
      width: DOMUtils.getComputedWidth(this.getDOMNode())
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
