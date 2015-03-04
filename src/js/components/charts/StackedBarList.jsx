/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var StackedBarList = React.createClass({

  displayName: "StackedBarList",

  propTypes: {
    stackedData: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    marginLeft: React.PropTypes.number.isRequired,
    peakline: React.PropTypes.bool.isRequired,
    y: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      maxY: 10,
      y: "y"
    };
  },

  getInitialState: function () {
    return {
      valuesLength: 0,
      posY: [],
      rectWidth: 0
    };
  },

  componentWillReceiveProps: function (props) {
    var stackedData = props.stackedData;
    var valuesLength;

    if (stackedData != null && stackedData.length !== 0) {
      valuesLength = _.last(stackedData).values.length;

      this.setState({
        valuesLength: valuesLength,
        posY: _.map(_.range(valuesLength), function () {
          return props.height;
        }),
        rectWidth: (props.width - props.marginLeft) / valuesLength
      });
    }
  },

  getBars: function (values, colorClass, i) {
    var props = this.props;
    var state = this.state;
    var lineClass = colorClass;
    var peaklineHeight = 2;
    var posY = state.posY;
    var rectWidth = state.rectWidth;
    var valuesLength = state.valuesLength;
    var y = props.y;

    if (!props.peakline) {
      peaklineHeight = 0;
      lineClass += " hidden";
    }

    return _.map(values, function (val, j) {
      var rectHeight = props.height * val[y] / props.maxY - peaklineHeight;

      var posX = props.width - props.marginLeft - rectWidth * (valuesLength - j);
      posY[j] -= rectHeight;

      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <g className="bar"
            key={i.toString() + j.toString()}
            transform={"translate(" + [posX, 0] + ")"}>
          <line
              className={lineClass}
              x1={0}
              y1={posY[j]}
              x2={rectWidth - 1}
              y2={posY[j]} />
          <rect
              className={colorClass}
              y={posY[j]}
              height={rectHeight}
              width={rectWidth - 1} />
        </g>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    var props = this.props;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <g>
      {
        _.map(props.stackedData, function (framework, i) {
        var colorClass = "path-color-" + framework.colorIndex;

        return this.getBars(framework.values, colorClass, i);
        }.bind(this))
      }
      </g>
    );
  }
});

module.exports = StackedBarList;
