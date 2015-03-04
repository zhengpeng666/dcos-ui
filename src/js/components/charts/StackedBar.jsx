/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var StackedBar = React.createClass({

  displayName: "StackedBar",

  propTypes: {
    posX: React.PropTypes.number.isRequired,
    posY: React.PropTypes.number.isRequired,
    rectHeight: React.PropTypes.number.isRequired,
    rectWidth: React.PropTypes.number.isRequired,
    colorClass: React.PropTypes.string.isRequired,
    lineClass: React.PropTypes.string.isRequired
  },

  render: function () {
    var props = this.props;
    var posX = props.posX;
    var posY = props.posY;
    var rectHeight = props.rectHeight;
    var rectWidth = props.rectWidth;
    var colorClass = props.colorClass;
    var lineClass = props.lineClass;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <g className="bar"
          transform={"translate(" + [posX, 0] + ")"}>
        <line
            className={lineClass}
            x1={0}
            y1={posY}
            x2={rectWidth - 1}
            y2={posY} />
        <rect
            className={colorClass}
            y={posY}
            height={rectHeight}
            width={rectWidth - 1} />
      </g>
    );
  }
});

module.exports = StackedBar;
