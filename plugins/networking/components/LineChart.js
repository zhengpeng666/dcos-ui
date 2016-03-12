import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

let SDK = require('../SDK').getSDK();

let Units = SDK.get('Units');

class LineChart extends React.Component {
  constructor() {
    super();

    this.state = {
      disabledSeries: {}
    };
  }

  componentDidMount() {
    let el = this.refs.chart;
    let options = this.getOptions();

    this.graph = new Dygraph(el, this.getGraphData(), options);
  }

  componentDidUpdate(prevProps) {
    let props = this.props;
    let options = _.extend(this.getOptions(), {file: this.getGraphData()});

    this.graph.updateOptions(options);

    if (prevProps.width !== props.width || prevProps.height !== props.height) {
      this.graph.resize(props.width, props.height);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.height !== this.props.height ||
      nextProps.width !== this.props.width) {
      return true;
    }

    if (!_.isEqual(nextProps.labels, this.props.labels)) {
      return true;
    }

    if (!_.isEqual(nextProps.data, this.props.data)) {
      return true;
    }

    if (!_.isEqual(nextState.disabledSeries, this.state.disabledSeries)) {
      return true;
    }

    return false;
  }

  handleLabelToggle(seriesID) {
    let visibleSeries = this.graph.visibility();
    let isEnabled = visibleSeries[seriesID];
    let disabledSeries = _.clone(this.state.disabledSeries);

    if (isEnabled) {
      disabledSeries[seriesID] = isEnabled;
      this.graph.setVisibility(seriesID, !isEnabled);
    } else {
      delete disabledSeries[seriesID];
      this.graph.setVisibility(seriesID, !isEnabled);
    }

    this.setState({disabledSeries});
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

  getOptions() {
    let options = _.extend({
        height: this.props.height,
        width: this.props.width
      },
      LineChart.defaultProps.chartOptions,
      this.props.chartOptions
    );

    if (!this.hasYAxisFormatter(this.props.chartOptions)) {
      let formatter = function (y) {
        return Units.contractNumber(y, {forceFixedPrecision: true});
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

    return options;
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

  getLegend() {
    let labels = this.props.chartOptions.labels;

    if (!labels) {
      return null;
    }

    let labelsHTML = labels.map((label, i) => {
      // The first index is the label for X, we don't want it.
      if (i === 0) {
        return null;
      }

      // From here on, the indexes start at 0
      let index = i - 1;
      let style = {
        // -1 because we don't have a color for x
        backgroundColor: this.props.chartOptions.colors[index]
      };

      let classes = classNames({
        clickable: true,
        disabled: this.state.disabledSeries[index]
      });

      return (
        <span
          className={classes}
          key={i}
          onClick={this.handleLabelToggle.bind(this, index)}>
          <span className="dot success" style={style}></span>
          {label}
        </span>
      );
    });

    // Pop off the first element
    labelsHTML.shift()

    return (
      <div className="graph-legend">
        {labelsHTML}
      </div>
    );
  }

  render() {
    return (
      <div className="dygraph-chart-wrapper">
        <div id="dygraph-hover-label" className="dygraph-hover-label"></div>
        <div ref="chart" className="dygraph-chart"></div>
        {this.getLegend()}
      </div>
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
      strokeWidth: 1.75,
      strokeBorderWidth: 0.5,
      highlightCircleSize: 3
    },
    labelsDiv: 'dygraph-hover-label',
    labelsDivStyles: {},
    labelsSeparateLines: true,
    legend: 'follow',
    labelsDivWidth: 200,
    showLegend: true,
    showLabelsOnHighlight: true,
    strokeWidth: 1.25,
    axes: {
      y: {
        axisLabelWidth: 35
      }
    }
  }
};

module.exports = LineChart;
