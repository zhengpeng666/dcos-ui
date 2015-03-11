/** @jsx React.DOM */

var d3 = require("d3");
var React = require("react/addons");

var Bar = React.createClass({

  displayName: "Bar",

  propTypes: {
    posX: React.PropTypes.number.isRequired,
    posY: React.PropTypes.number.isRequired,
    rectHeight: React.PropTypes.number.isRequired,
    rectWidth: React.PropTypes.number.isRequired,
    colorClass: React.PropTypes.string.isRequired,
    lineClass: React.PropTypes.string.isRequired
  },

  componentDidMount: function () {
    this.animate(this.props);
  },

  componentWillUpdate: function () {
    if (!this.props.transitionDelay && !this.props.transitionDuration) {
      return;
    }

    // here we reset the position of the bar to what it was before the animation started
    // the bar is reset right before we update the bar to the new value
    d3.select(this.getDOMNode()).interrupt()
      .transition()
      .duration(0)
      .attr("transform", "translate(" + this.props.posX + ")");
  },

  componentDidUpdate: function (props) {
    this.animate(props);
  },

  animate: function (props) {
    if (!props.transitionDelay && !props.transitionDuration) {
      return;
    }
    d3.select(this.getDOMNode()).interrupt()
      .transition()
        .delay(props.transitionDelay)
        .duration(props.transitionDuration)
        .ease("linear")
        .attr("transform", "translate(" + (props.posX - props.rectWidth) + ")");

    return true;
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

module.exports = Bar;
