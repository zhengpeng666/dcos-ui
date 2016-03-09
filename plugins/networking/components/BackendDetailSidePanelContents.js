/*eslint-disable no-unused-vars*/
const React = require('react');
/*eslint-enable no-unused-vars*/

import ClientsTable from './ClientsTable';
import MesosStateStore from '../../../src/js/stores/MesosStateStore';
import MesosSummaryStore from '../../../src/js/stores/MesosSummaryStore';
import NetworkItemDetails from './NetworkItemDetails';
import NetworkingBackendConnectionsStore from '../stores/NetworkingBackendConnectionsStore';
import RequestErrorMsg from '../../../src/js/components/RequestErrorMsg';
import SidePanelContents from '../../../src/js/components/SidePanelContents';
import StringUtil from '../../../src/js/utils/StringUtil';

class BackendDetailSidePanelContents extends SidePanelContents {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: 'networkingBackendConnections',
        events: ['success', 'error']
      }
    ];

    this.tabs_tabs = {
      clients: 'Clients'
    };

    this.state = {currentTab: Object.keys(this.tabs_tabs).shift()};

    this.internalStorage_update({
      backendConnectionRequestSuccess: false,
      backendConnectionRequestErrorCount: 0
    });
  }

  componentDidMount() {
    super.componentDidMount();
    NetworkingBackendConnectionsStore.fetchVIPBackendConnections(this.props.protocol, this.props.vip,
      this.props.port);
  }

  onNetworkingBackendConnectionsStoreError() {
    let backendConnectionRequestErrorCount = this.internalStorage_get().backendConnectionRequestErrorCount + 1;
    this.internalStorage_update({backendConnectionRequestErrorCount});
    this.forceUpdate();
  }

  onNetworkingBackendConnectionsStoreSuccess() {
    this.internalStorage_update({
      backendConnectionRequestSuccess: true,
      backendConnectionRequestErrorCount: 0
    });
    this.addDetailsTab();
    this.forceUpdate();
  }

  addDetailsTab() {
    let backendDetails = NetworkingBackendConnectionsStore.getBackendConnections(
      `${this.props.protocol}:${this.props.vip}:${this.props.port}`
    );

    if (backendDetails.details && Object.keys(backendDetails.details).length) {
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
          Backend
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
    let backendConnectionRequestErrorCount = this.internalStorage_get().backendConnectionRequestErrorCount;
    return backendConnectionRequestErrorCount >= 3;
  }

  isLoading() {
    let timeSinceMount = (Date.now() - this.mountedAt) / 1000;
    let backendConnectionRequestSuccess = this.internalStorage_get().backendConnectionRequestSuccess;

    return !(timeSinceMount >= SidePanelContents.animationLengthSeconds)
      || !backendConnectionRequestSuccess;
  }

  renderClientsTabView() {
    let content;

    if (this.hasError()) {
      content = <RequestErrorMsg />;
    } else if (this.isLoading()) {
      content = this.getLoadingScreen();
    } else {
      let backendConnectionDetails = NetworkingBackendConnectionsStore
        .getBackendConnections(
          `${this.props.protocol}:${this.props.vip}:${this.props.port}`
        );

      content = (
        <ClientsTable clients={backendConnectionDetails.getClients()}
          parentRouter={this.props.parentRouter} />
      );
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
    let backendDetails = NetworkingBackendConnectionsStore
      .getBackendConnections(
        `${this.props.protocol}:${this.props.vip}:${this.props.port}`
      );

    return <NetworkItemDetails details={backendDetails.details} />;
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

module.exports = BackendDetailSidePanelContents;
