import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';

class LineChart extends React.Component {
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    let options = _.extend({},
      LineChart.defaultProps.chartOptions,
      this.props.chartOptions
    );

    this.graph = new Dygraph(el, this.getGraphData(), options);
  }

  componentWillUpdate() {
    this.graph.updateOptions({file: this.getGraphData()});
  }

  getGraphData() {
    return this.transpose(this.props.labels, this.props.data);
  }

  /**
   * Will take in an array of labels and array of of lines
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
    return (
      <div></div>
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
    showRoller: true
  }
};

module.exports = LineChart;
