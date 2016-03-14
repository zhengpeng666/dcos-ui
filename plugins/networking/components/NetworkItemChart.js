import React from 'react';

import LineChart from './LineChart';
import utils from '../utils';

let SDK = require('../SDK').getSDK();

let Chart = SDK.get('Chart');

// Number to fit design of width vs. height ratio.
const WIDTH_HEIGHT_RATIO = 3.5;
// Number of data points to fill the graph with.
const TIMESERIES_DATA_POINTS = 60;

const SUCCESS_DATASET_COLORS = ['#27c97b', '#f34e3d'];
const SUCCESS_DATASET_LABELS = ['Minutes ago', 'Successes', 'Failures'];
const REACHABILITY_DATASET_COLORS = ['#27c97b', '#f34e3d', '#16cbff', '#fedc39',
  '#7f33de'];
const REACHABILITY_DATASET_LABELS = ['Minutes ago', 'P50', 'P75', 'P90', 'P95',
  'P99'];

class NetworkItemChart extends React.Component {
  getChartColors() {
    if (this.props.selectedData === 'success') {
      return SUCCESS_DATASET_COLORS;
    } else if (this.props.selectedData === 'app-reachability' ||
      this.props.selectedData === 'machine-reachability') {
      return REACHABILITY_DATASET_COLORS;
    }
  }

  getChartData(itemData) {
    let normalizedData;

    if (this.props.selectedData === 'success') {
      normalizedData = utils.normalizeTimeSeriesData(
        [itemData.getRequestSuccesses(), itemData.getRequestFailures()],
        {maxIntervals: TIMESERIES_DATA_POINTS}
      );
    } else if (this.props.selectedData === 'app-reachability') {
      normalizedData = utils.normalizeTimeSeriesData(
        [
          itemData.getApplicationReachability50(),
          itemData.getApplicationReachability75(),
          itemData.getApplicationReachability90(),
          itemData.getApplicationReachability95(),
          itemData.getApplicationReachability99()
        ],
        {maxIntervals: TIMESERIES_DATA_POINTS}
      );
    } else if (this.props.selectedData === 'machine-reachability') {
      normalizedData = utils.normalizeTimeSeriesData(
        [
          itemData.getMachineReachability50(),
          itemData.getMachineReachability75(),
          itemData.getMachineReachability90(),
          itemData.getMachineReachability95(),
          itemData.getMachineReachability99()
        ],
        {maxIntervals: TIMESERIES_DATA_POINTS}
      );
    }

    return normalizedData;
  }

  getChartDataLabels() {
    if (this.props.selectedData === 'success') {
      return SUCCESS_DATASET_LABELS;
    } else if (this.props.selectedData === 'app-reachability'
      || this.props.selectedData === 'machine-reachability') {
      return REACHABILITY_DATASET_LABELS;
    }
  }

  getChartYAxisLabel() {
    switch (this.props.selectedData) {
      case 'success':
        return 'Requests';
        break;
      case 'app-reachability':
        return 'App Reachability';
        break;
      case 'machine-reachability':
        return 'IP Reachability';
        break;
    }
  }

  labelFormatter(x) {
    if (x === 0) {
      return 0;
    }

    return `-${x}m`;
  }

  render() {
    let colors = this.getChartColors();
    let data = this.getChartData(this.props.chartData);
    let dataLabels = this.getChartDataLabels();
    let yAxisLabel = this.getChartYAxisLabel();

    let labels = [];
    for (let i = TIMESERIES_DATA_POINTS; i >= 0; i--) {
      labels.push(i);
    }

    let chartOptions = {
      axes: {
        x: {
          axisLabelFormatter: this.labelFormatter,
          valueFormatter: this.labelFormatter,
          gridLinePattern: [4,4],
          // Max of 4 chars (-60m) and each character is 10px in length
          axisLabelWidth: 4 * 10
        },
        y: {
          gridLinePattern: 55,
          axisLabelWidth: 4 * 10
        }
      },
      colors,
      labels: dataLabels,
      ylabel: yAxisLabel
    };

    return (
      <div className="container-pod container-pod-short">
        <Chart calcHeight={function (w) { return w / WIDTH_HEIGHT_RATIO; }}
          delayRender={true}>
          <LineChart
            data={data}
            key={this.props.selectedData}
            labels={labels}
            chartOptions={chartOptions} />
        </Chart>
      </div>
    );
  }
}

module.exports = NetworkItemChart;
