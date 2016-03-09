/*eslint-disable no-unused-vars*/
const React = require('react');
/*eslint-enable no-unused-vars*/

import BackendsTable from './BackendsTable';
import NetworkingVIPsStore from '../stores/NetworkingVIPsStore';

let SDK = require('../SDK').getSDK();

let {SidePanelContents, RequestErrorMsg, DescriptionList} = SDK.get([
  'SidePanelContents', 'RequestErrorMsg', 'DescriptionList'
]);

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

  componentDidMount() {
    super.componentDidMount();
    NetworkingVIPsStore.fetchVIPDetail(this.props.protocol, this.props.vip,
      this.props.port);
  }

  onNetworkingVIPsStoreDetailError() {
    let vipDetailErrorCount = this.internalStorage_get().vipDetailErrorCount + 1;
    this.internalStorage_update({vipDetailErrorCount});
    this.forceUpdate();
  }

  onNetworkingVIPsStoreDetailSuccess() {
    this.internalStorage_update({
      vipDetailSuccess: true,
      vipDetailErrorCount: 0
    });
    this.addDetailsTab();
    this.forceUpdate();
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

  renderBackendsTabView() {
    let content;

    if (this.hasError()) {
      content = <RequestErrorMsg />;
    } else if (this.isLoading()) {
      content = this.getLoadingScreen();
    } else {
      let vipDetails = NetworkingVIPsStore.getVIPDetail(
        `${this.props.protocol}:${this.props.vip}:${this.props.port}`
      );
      content = <BackendsTable backends={vipDetails.getBackends()} />;
    }

    return (
      <div className="side-panel-tab-content side-panel-section container
        container-fluid container-pod container-pod-short flex-container-col
        flex-grow">
        {content}
      </div>
    );
  }

  renderDetailsTabView() {
    let vipDetails = NetworkingVIPsStore.getVIPDetail(
      `${this.props.protocol}:${this.props.vip}:${this.props.port}`
    );

    let details = vipDetails.details.map(function (detail) {
      return <DescriptionList headline={detail.name} hash={detail.labels} />;
    });

    return (
      <div className="side-panel-tab-content side-panel-section container
        container-fluid container-pod container-pod-short flex-container-col
        flex-grow">
        {details}
      </div>
    );
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
