/*eslint-disable no-unused-vars*/
const React = require('react');
/*eslint-enable no-unused-vars*/

import BackendsTable from './BackendsTable';
import LineChart from './LineChart';
import NetworkingVIPsStore from '../stores/NetworkingVIPsStore';
import NetworkItemDetails from './NetworkItemDetails';

let SDK = require('../SDK').getSDK();

let {Chart, SidePanelContents, RequestErrorMsg} = SDK.get([
  'Chart', 'SidePanelContents', 'RequestErrorMsg'
]);

// number to fit design of width vs. height ratio
const WIDTH_HEIGHT_RATIO = 3.5;

class VIPDetailSidePanelContents extends SidePanelContents {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: 'networkingVIPs',
        events: ['detailSuccess', 'detailError']
      }
    ];

    this.tabs_tabs = {
      backends: 'Backends'
    };

    this.state = {currentTab: Object.keys(this.tabs_tabs).shift()};

    this.internalStorage_update({
      vipDetailSuccess: false,
      vipDetailErrorCount: 0
    });
  }

  componentWillUpdate() {
    super.componentWillUpdate(...arguments);
    NetworkingVIPsStore.startFetchVIPDetail(
      this.props.protocol, this.props.vip, this.props.port
    );
  }

  componentWillUnmount() {
    super.componentWillUnmount(...arguments);
    NetworkingVIPsStore.stopFetchVIPDetail();
  }

  onNetworkingVIPsStoreDetailError() {
    let vipDetailErrorCount = this.internalStorage_get().vipDetailErrorCount + 1;
    this.internalStorage_update({vipDetailErrorCount});
  }

  onNetworkingVIPsStoreDetailSuccess() {
    this.internalStorage_update({
      vipDetailSuccess: true,
      vipDetailErrorCount: 0
    });
    this.addDetailsTab();
  }

  addDetailsTab() {
    let vipDetails = NetworkingVIPsStore.getVIPDetail(
      `${this.props.protocol}:${this.props.vip}:${this.props.port}`
    );

    if (vipDetails.details && Object.keys(vipDetails.details).length) {
      this.tabs_tabs.details = 'Details';
    }
  }

  getBasicInfo(vip, port) {
    return (
      <div className="side-panel-content-header">
        <h1 className="side-panel-content-header-label flush">
          {`${vip}:${port}`}
        </h1>
        <div className="container-pod container-pod-short
          container-pod-super-short-top">
          Virtual IP
        </div>
      </div>
    );
  }

  getLoadingScreen() {
    return (
      <div className="container container-fluid container-pod text-align-center
        vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  hasError() {
    let vipDetailErrorCount = this.internalStorage_get().vipDetailErrorCount;
    return vipDetailErrorCount >= 3;
  }

  isLoading() {
    let timeSinceMount = (Date.now() - this.mountedAt) / 1000;
    let vipDetailSuccess = this.internalStorage_get().vipDetailSuccess;

    return !(timeSinceMount >= SidePanelContents.animationLengthSeconds)
      || !vipDetailSuccess;
  }

  getChart(vipDetails) {
    let chartData = [
      vipDetails.getRequestSuccesses(),
      vipDetails.getRequestFailures()
    ];
    let labels = [];
    for (var i = 60; i >= 0; i--) {
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
      colors: ['#27C97B', '#F33745'],
      labels: ['Minutes ago', 'Successes', 'Failures'],
      ylabel: 'Requests'
    };

    return (
      <div className="container-pod">
        <Chart calcHeight={function (w) { return w / WIDTH_HEIGHT_RATIO; }}
          delayRender={true}>
          <LineChart
            data={chartData}
            labels={labels}
            chartOptions={chartOptions} />
        </Chart>
      </div>
    );
  }

  renderBackendsTabView() {
    let content;
    let chart;

    if (this.hasError()) {
      content = <RequestErrorMsg />;
    } else if (this.isLoading()) {
      content = this.getLoadingScreen();
    } else {
      let vipDetails = NetworkingVIPsStore.getVIPDetail(
        `${this.props.protocol}:${this.props.vip}:${this.props.port}`
      );

      chart = this.getChart(vipDetails);
      content = (<BackendsTable backends={vipDetails.getBackends()}
        vipProtocol={this.props.protocol}
        parentRouter={this.props.parentRouter} />);
    }

    return (
      <div className="side-panel-tab-content side-panel-section container
        container-fluid container-pod container-pod-short flex-container-col
        flex-grow">
        {chart}
        {content}
      </div>
    );
  }

  renderDetailsTabView() {
    let vipDetails = NetworkingVIPsStore.getVIPDetail(
      `${this.props.protocol}:${this.props.vip}:${this.props.port}`
    );

    return <NetworkItemDetails details={vipDetails.details} />;
  }

  render() {
    return (
      <div className="flex-container-col">
        <div className="side-panel-section side-panel-content-header container
          container-pod container-fluid container-pod-divider-bottom
          container-pod-divider-bottom-align-right flush-bottom">
          {this.getBasicInfo(this.props.vip, this.props.port)}
          <ul className="tabs list-inline flush-bottom">
            {this.tabs_getUnroutedTabs()}
          </ul>
        </div>
        {this.tabs_getTabView()}
      </div>
    );
  }
}

module.exports = VIPDetailSidePanelContents;
