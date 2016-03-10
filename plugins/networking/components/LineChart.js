import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';

let SDK = require('../SDK').getSDK();

let Units = SDK.get('Units');

class LineChart extends React.Component {
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    let options = _.extend({
        height: this.props.height,
        width: this.props.width
      },
      LineChart.defaultProps.chartOptions,
      this.props.chartOptions
    );

    if (!this.hasYAxisFormatter(this.props.chartOptions)) {
      let formatter = function (y) {
        return Units.contractNumber(y);
      };

      if (!options.axes) {
        options.axes = {};
      }

      if (!options.axes.y) {
        options.axes.y = {};
      }

      options.axes.y.axisLabelFormatter = formatter;
      options.axes.y.valueFormatter = formatter;
    }

    this.graph = new Dygraph(el, this.getGraphData(), options);
  }

  componentDidUpdate(prevProps) {
    let props = this.props;

    this.graph.updateOptions({file: this.getGraphData()});

    if (prevProps.width !== props.width || prevProps.height !== props.height) {
      this.graph.resize(props.width, props.height);
    }
  }

  hasYAxisFormatter(options) {
    return options.axes &&
      options.axes.y &&
      options.axes.y.axisLabelFormatter;
  }

  getMaxLengthForSet(set) {
    let longestValue = 1;
    set.forEach(function(value) {
      let valueString = value.toString();
      if (valueString.length > longestValue) {
        longestValue = valueString.length;
      }
    });

    return longestValue;
  }

  getGraphData() {
    return this.transpose(this.props.labels, this.props.data);
  }

  /**
   * Will take in an array of labels and array of lines
   * with their datapoints and will get the data ready for dygraphs
   * For example: (['a', 'b'], [[1, 2], [3, 4]]) will return:
   * [['a', 1, 3], ['b', 2, 4]]
   *
   * @param  {Array} labels
   * @param  {Array} data
   * @return {Array} An array
   */
  transpose(labels, data) {
    return labels.map(function (label, labelIndex) {
      let xPoints = [label];
      for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
        xPoints.push(data[dataIndex][labelIndex]);
      }

      return xPoints;
    });
  }

  render() {
    let height = `${this.props.height}px`;
    let width = `${this.props.width}px`;
    return (
      <div className="dygraph-chart" height={height} width={width}></div>
    );
  }
}

LineChart.propTypes = {
  labels: React.PropTypes.array.isRequired,
  data: React.PropTypes.arrayOf(
    React.PropTypes.array.isRequired
  ).isRequired,
  chartOptions: React.PropTypes.object
};

LineChart.defaultProps = {
  chartOptions: {
    drawPoints: false,
    axisLineColor: '#CBCED1',
    gridLineColor: '#CBCED1',
    highlightSeriesOpts: {
      strokeWidth: 1.5,
      strokeBorderWidth: 0.5,
      highlightCircleSize: 3
    },
    labelsSeparateLines: true,
    legend: 'follow',
    labelsDivWidth: 125,
    strokeWidth: 1.5,
    axes: {
      y: {
        axisLabelWidth: 35
      }
    }
  }
};

module.exports = LineChart;
