import {Dropdown} from 'reactjs-components';
/*eslint-disable no-unused-vars*/
const React = require('react');
/*eslint-enable no-unused-vars*/

import BackendsTable from './BackendsTable';
import LineChart from './LineChart';
import NetworkingVIPsStore from '../stores/NetworkingVIPsStore';
import NetworkItemDetails from './NetworkItemDetails';
import utils from '../utils';

let SDK = require('../SDK').getSDK();

let {Chart, SidePanelContents, RequestErrorMsg, Tooltip} = SDK.get([
  'Chart', 'SidePanelContents', 'RequestErrorMsg', 'Tooltip'
]);

// number to fit design of width vs. height ratio
const WIDTH_HEIGHT_RATIO = 3.5;
// number of data points to fill the graph with
const TIMESERIES_DATA_POINTS = 60;

const METHODS_TO_BIND = ['handleVIPDetailDropdownChange'];

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

    this.state = {
      currentTab: Object.keys(this.tabs_tabs).shift(),
      selectedDropdownItem: 'success'
    };

    this.internalStorage_update({
      vipDetailSuccess: false,
      vipDetailErrorCount: 0
    });

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    NetworkingVIPsStore.startFetchVIPDetail(this.props.protocol,
      this.props.vip, this.props.port);
  }

  componentWillUnmount() {
    super.componentWillUnmount(...arguments);
    NetworkingVIPsStore.stopFetchVIPDetail();
  }

  onNetworkingVIPsStoreDetailError() {
    let vipDetailErrorCount = this.internalStorage_get()
      .vipDetailErrorCount + 1;
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

  getChart(vipDetails) {
    let colors = this.getChartColors();
    let data = this.getChartData(vipDetails);
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
            labels={labels}
            chartOptions={chartOptions} />
        </Chart>
      </div>
    );
  }

  getChartColors() {
    if (this.state.selectedDropdownItem === 'success') {
      return ['#27c97b', '#f34e3d'];
    } else if (this.state.selectedDropdownItem === 'app-reachability' ||
      this.state.selectedDropdownItem === 'machine-reachability') {
      return ['#27c97b', '#f34e3d', '#16cbff', '#fedc39', '#7f33de'];
    }
  }

  getChartData(vipDetails) {
    let normalizedData;

    if (this.state.selectedDropdownItem === 'success') {
      normalizedData = utils.normalizeTimeSeriesData(
        [vipDetails.getRequestSuccesses(), vipDetails.getRequestFailures()],
        {maxIntervals: TIMESERIES_DATA_POINTS}
      );
    } else if (this.state.selectedDropdownItem === 'app-reachability') {
      normalizedData = utils.normalizeTimeSeriesData(
        [
          vipDetails.getApplicationReachability50(),
          vipDetails.getApplicationReachability75(),
          vipDetails.getApplicationReachability90(),
          vipDetails.getApplicationReachability95(),
          vipDetails.getApplicationReachability99()
        ],
        {maxIntervals: TIMESERIES_DATA_POINTS}
      );
    } else if (this.state.selectedDropdownItem === 'machine-reachability') {
      normalizedData = utils.normalizeTimeSeriesData(
        [
          vipDetails.getMachineReachability50(),
          vipDetails.getMachineReachability75(),
          vipDetails.getMachineReachability90(),
          vipDetails.getMachineReachability95(),
          vipDetails.getMachineReachability99()
        ],
        {maxIntervals: TIMESERIES_DATA_POINTS}
      );
    }

    return normalizedData;
  }

  getChartDataLabels() {
    if (this.state.selectedDropdownItem === 'success') {
      return ['Minutes ago', 'Successes', 'Failures'];
    } else if (this.state.selectedDropdownItem === 'app-reachability') {
      return [
        'Minutes ago',
        'App Reachability 50',
        'App Reachability 75',
        'App Reachability 90',
        'App Reachability 95',
        'App Reachability 99'
      ];
    } else if (this.state.selectedDropdownItem === 'machine-reachability') {
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
    if (this.state.selectedDropdownItem === 'success') {
      return 'Requests';
    } else if (this.state.selectedDropdownItem === 'app-reachability') {
      return 'App Reachability';
    } else if (this.state.selectedDropdownItem === 'machine-reachability') {
      return 'IP Reachability';
    }
  }

  getDropdownItems(backendCount) {
    return [
      {
        html: 'Successes and Failures',
        selectedHtml: this.getDropdownItemSelectedHtml('Successes and Failures',
          backendCount),
        id: 'success'
      },
      {
        html: 'Application Reachability',
        selectedHtml: this.getDropdownItemSelectedHtml(
          'Application Reachability Percentage', backendCount),
        id: 'app-reachability'
      },
      {
        html: 'IP Reachability',
        selectedHtml: this.getDropdownItemSelectedHtml(
          'IP Reachability Percentage', backendCount),
        id: 'machine-reachability'
      }
    ];
  }

  getDropdownItemSelectedHtml(label, backendCount) {
    return (
      <span className="dropdown-toggle-label text-align-left">
        <span className="dropdown-toggle-label-primary">
          {label} per Minute
        </span>
        <span className="dropdown-toggle-label-secondary mute">
          {backendCount} Total Backends
        </span>
      </span>
    );
  }

  getSidePanelContent(backends) {
    return (
      <BackendsTable backends={backends}
        displayedData={this.state.selectedDropdownItem}
        vipProtocol={this.props.protocol}
        parentRouter={this.props.parentRouter} />
    );
  }

  getSidePanelHeading(backends) {
    return (
      <div className="vip-details-heading row row-flex">
        <div className="column-9">
          <Dropdown
            buttonClassName="button dropdown-toggle
              dropdown-toggle-transparent dropdown-toggle-caret-align-top"
            dropdownMenuClassName="dropdown-menu"
            dropdownMenuListClassName="dropdown-menu-list"
            dropdownMenuListItemClassName="clickable"
            initialID="success"
            items={this.getDropdownItems(backends.getItems().length)}
            onItemSelection={this.handleVIPDetailDropdownChange}
            transition={true}
            transitionName="dropdown-menu"
            wrapperClassName="dropdown" />
        </div>
        <div className="column-3 text-align-right">
          <Tooltip iconClass="icon icon-sprite icon-sprite-mini
            icon-information" behavior="show-tip" tipPlace="top-left"
            content="Lorem ipsum dolor sit amet." />
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

  handleVIPDetailDropdownChange(item) {
    this.setState({selectedDropdownItem: item.id});
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

  renderBackendsTabView() {
    let content;
    let chart;
    let vipDetailsHeading;

    if (this.hasError()) {
      content = <RequestErrorMsg />;
    } else if (this.isLoading()) {
      content = this.getLoadingScreen();
    } else {
      let vipDetails = NetworkingVIPsStore.getVIPDetail(
        `${this.props.protocol}:${this.props.vip}:${this.props.port}`
      );
      let backends = vipDetails.getBackends();

      chart = this.getChart(vipDetails);
      content = this.getSidePanelContent(backends);
      vipDetailsHeading = this.getSidePanelHeading(backends);
    }

    return (
      <div className="side-panel-tab-content side-panel-section container
        container-fluid container-pod container-pod-short flex-container-col
        flex-grow">
        {vipDetailsHeading}
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
