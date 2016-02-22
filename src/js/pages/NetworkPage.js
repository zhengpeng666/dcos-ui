import mixin from 'reactjs-mixin';
import React from 'react';
import {RouteHandler} from 'react-router';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AlertPanel from '../components/AlertPanel';
import FilterHeadline from '../components/FilterHeadline';
import FilterInputText from '../components/FilterInputText';
import NetworkingVIPSummariesStore from '../stores/NetworkingVIPSummariesStore';
import Page from '../components/Page';
import RequestErrorMsg from '../components/RequestErrorMsg';
import VIPsTable from '../components/VIPsTable';

const METHODS_TO_BIND = [
  'handleSearchStringChange',
  'onNetworkingVIPSummariesStoreVipSummariesError',
  'onNetworkingVIPSummariesStoreVipSummariesSuccess',
  'resetFilter'
];

class NetworkPage extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      receivedVIPSummaries: false,
      searchString: ''
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.store_listeners = [
      {
        name: 'networkingVIPSummaries',
        events: [
          'vipSummariesSuccess',
          'vipSummariesError'
        ]
      }
    ];
  }

  componentDidMount() {
    super.componentDidMount();
    NetworkingVIPSummariesStore.fetchVIPSummaries();
  }

  onNetworkingVIPSummariesStoreVipSummariesError() {
    this.setState({hasErrors: true});
  }

  onNetworkingVIPSummariesStoreVipSummariesSuccess() {
    this.setState({receivedVIPSummaries: true});
  }

  getEmptyNetworkPageContent() {
    return (
      <AlertPanel
        title="No Networks Detected"
        iconClassName="icon icon-sprite icon-sprite-jumbo
          icon-sprite-jumbo-white icon-services flush-top">
        <p className="flush">
          Use the DCOS command line tools to create VIPs.
        </p>
      </AlertPanel>
    );
  }

  getErrorScreen() {
    return <RequestErrorMsg />;
  }

  getFilteredVIPSummaries(vipSummaries, searchString = '') {
    if (searchString === '') {
      return vipSummaries;
    }

    return vipSummaries.filter(function (vipSummary) {
      if (vipSummary.vip.indexOf(searchString) > -1) {
        return true;
      }

      return false;
    });
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

  getNetworkPageContent() {
    let vipSummaries = this.getVIPSummaries();
    let filteredVIPSummaries = this.getFilteredVIPSummaries(
      vipSummaries, this.state.searchString
    );

    if (vipSummaries.length === 0) {
      return this.getEmptyNetworkPageContent();
    }

    return (
      <div>
        <FilterHeadline
          onReset={this.resetFilter}
          name="Virual IPs"
          currentLength={filteredVIPSummaries.length}
          totalLength={vipSummaries.length} />
        <ul className="list list-unstyled list-inline flush-bottom">
          <li>
            <FilterInputText
              searchString={this.state.searchString}
              handleFilterChange={this.handleSearchStringChange}
              inverseStyle={true} />
          </li>
        </ul>
        <VIPsTable vips={filteredVIPSummaries} />
      </div>
    );
  }

  getVIPSummaries() {
    let vipSummaries = NetworkingVIPSummariesStore.getVIPSummaries().getItems();

    return vipSummaries.map(function (vipSummary) {
      return {
        vip: vipSummary.getVIPString(),
        successLastMinute: vipSummary.getSuccessLastMinute(),
        failLastMinute: vipSummary.getFailLastMinute(),
        failurePerecent: vipSummary.getFailPercent(),
        applicationReachabilityPercent: vipSummary.getApplicationReachabilityPercent(),
        machineReachabilityPercent: vipSummary.getMachineReachabilityPercent(),
        p99Latency: vipSummary.getP99Latency()
      };
    });
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  isLoading() {
    return !this.state.receivedVIPSummaries;
  }

  resetFilter() {
    this.setState({searchString: ''});
  }

  render() {
    let content = null;

    if (this.isLoading()) {
      content = this.getLoadingScreen();
    } else if (this.state.hasErrors) {
      content = this.getErrorScreen();
    } else {
      content = this.getNetworkPageContent();
    }

    return (
      <Page title="Network">
        {content}
        <RouteHandler />
      </Page>
    );
  }
}

NetworkPage.contextTypes = {
  router: React.PropTypes.func
};

NetworkPage.routeConfig = {
  label: 'Network',
  icon: 'network',
  matches: /^\/network/
};

module.exports = NetworkPage;
