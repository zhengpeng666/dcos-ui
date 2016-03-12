import React from 'react';

import LineChart from './LineChart';
import utils from '../utils';

let SDK = require('../SDK').getSDK();

let {Chart} = SDK.get(['Chart']);

// number to fit design of width vs. height ratio
const WIDTH_HEIGHT_RATIO = 3.5;
// number of data points to fill the graph with
const TIMESERIES_DATA_POINTS = 60;

class NetworkItemChart extends React.Component {
  getChartColors() {
    if (this.props.selectedData === 'success') {
      return ['#27c97b', '#f34e3d'];
    } else if (this.props.selectedData === 'app-reachability' ||
      this.props.selectedData === 'machine-reachability') {
      return ['#27c97b', '#f34e3d', '#16cbff', '#fedc39', '#7f33de'];
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
      return ['Minutes ago', 'Successes', 'Failures'];
    } else if (this.props.selectedData === 'app-reachability') {
      return [
        'Minutes ago',
        'App Reachability 50',
        'App Reachability 75',
        'App Reachability 90',
        'App Reachability 95',
        'App Reachability 99'
      ];
    } else if (this.props.selectedData === 'machine-reachability') {
      return [
        'Minutes ago',
        'IP Reachability 50',
        'IP Reachability 75',
        'IP Reachability 90',
        'IP Reachability 95',
        'IP Reachability 99'
      ];
    }
  }

  getChartYAxisLabel() {
    if (this.props.selectedData === 'success') {
      return 'Requests';
    } else if (this.props.selectedData === 'app-reachability') {
      return 'App Reachability';
    } else if (this.props.selectedData === 'machine-reachability') {
      return 'IP Reachability';
    }
  }

  render() {
    let colors = this.getChartColors();
    let data = this.getChartData(this.props.chartData);
    let dataLabels = this.getChartDataLabels();
    let yAxisLabel = this.getChartYAxisLabel();

    let labels = [];
    for (var i = TIMESERIES_DATA_POINTS; i >= 0; i--) {
      labels.push(i);
    }

    let formatter = function (x) {
      if (x === 0) {
        return 0;
      }

      return `-${x}m`;
    };

    let chartOptions = {
      axes: {
        x: {
          axisLabelFormatter: formatter,
          valueFormatter: formatter,
          gridLinePattern: [4,4],
          // Max of 4 chars (-60m) and each character is 10px in length
          axisLabelWidth: 4 * 10
        },
        y: {
          gridLinePattern: 55,
          axisLabelWidth: 4 * 10
        }
      },
      colors: colors,
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
