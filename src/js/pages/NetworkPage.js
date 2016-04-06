import mixin from 'reactjs-mixin';
import React from 'react';
import {RouteHandler} from 'react-router';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AlertPanel from '../components/AlertPanel';
import FilterHeadline from '../components/FilterHeadline';
import FilterInputText from '../components/FilterInputText';
import {Hooks} from 'PluginSDK';
import NetworkingVIPSummariesStore from '../stores/NetworkingVIPSummariesStore';
import Page from '../components/Page';
import SidebarActions from '../events/SidebarActions';
import RequestErrorMsg from '../components/RequestErrorMsg';
import VIPsTable from '../components/VIPsTable';

const METHODS_TO_BIND = [
  'handleSearchStringChange',
  'onNetworkingVIPSummariesStoreError',
  'onNetworkingVIPSummariesStoreSuccess',
  'resetFilter'
];

class NetworkPage extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      receivedVIPSummaries: false,
      searchString: '',
      vipSummariesErrorCount: 0
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.store_listeners = [
      {
        name: 'networkingVIPSummaries',
        events: ['success', 'error']
      }
    ];
  }

  componentDidMount() {
    super.componentDidMount();
    NetworkingVIPSummariesStore.fetchVIPSummaries();
  }

  onNetworkingVIPSummariesStoreError() {
    let vipSummariesErrorCount = this.state.vipSummariesErrorCount + 1;
    this.setState({vipSummariesErrorCount});
  }

  onNetworkingVIPSummariesStoreSuccess() {
    this.setState({receivedVIPSummaries: true, vipSummariesErrorCount: 0});
  }

  getEmptyNetworkPageContent() {
    return (
      <AlertPanel
        title="No Networks Detected"
        iconClassName="icon icon-sprite icon-sprite-jumbo
          icon-sprite-jumbo-white icon-services flush-top">
        <p className="flush">
          Check out the <a href="https://docs.mesosphere.com/administration/service-discovery/virtual-ip-addresses/" target="_blank">networking documentation</a> for ways to create VIPs.
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
      return vipSummary.vip.indexOf(searchString) > -1;
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
        <div className="row row-flex row-flex-align-vertical-bottom">
          <div className="column-6">
            <FilterHeadline
              inverseStyle={true}
              onReset={this.resetFilter}
              name="Virtual IPs"
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
          </div>
          <div className="column-6 text-align-right text-super-muted inverse">
            <div className="form-group">
              All stats are for the past minute
            </div>
          </div>
        </div>
        <VIPsTable vips={filteredVIPSummaries} />
      </div>
    );
  }

  getVIPSummaries() {
    let vipSummaries = NetworkingVIPSummariesStore.getVIPSummaries().getItems();

    return vipSummaries.map(function (vipSummary) {
      return {
        fullVIP: vipSummary.getVIP(),
        vip: vipSummary.getVIPString(),
        successLastMinute: vipSummary.getSuccessLastMinute(),
        failLastMinute: vipSummary.getFailLastMinute(),
        failurePercent: vipSummary.getFailPercent(),
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

    if (this.state.vipSummariesErrorCount >= 3) {
      content = this.getErrorScreen();
    } else if (this.isLoading()) {
      content = this.getLoadingScreen();
    } else {
      content = Hooks.applyFilter('NetworkingPageContent',
        this.getNetworkPageContent(), this.props.params, 'network');
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

NetworkPage.willTransitionTo = function () {
  SidebarActions.close();
};

module.exports = NetworkPage;
