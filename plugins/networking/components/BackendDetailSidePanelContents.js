import {Dropdown} from 'reactjs-components';
/*eslint-disable no-unused-vars*/
const React = require('react');
/*eslint-enable no-unused-vars*/

import ClientsTable from './ClientsTable';
import NetworkItemChart from './NetworkItemChart';
import NetworkItemDetails from './NetworkItemDetails';
import NetworkingBackendConnectionsStore from '../stores/NetworkingBackendConnectionsStore';

let SDK = require('../SDK').getSDK();
let {RequestErrorMsg, SidePanelContents, StringUtil, Tooltip} = SDK.get([
  'RequestErrorMsg', 'SidePanelContents', 'StringUtil', 'Tooltip']);

const METHODS_TO_BIND = ['handleBackendDetailDropdownChange'];

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

    this.state = {
      currentTab: Object.keys(this.tabs_tabs).shift(),
      selectedDropdownItem: 'success'
    };

    this.internalStorage_update({
      backendConnectionRequestSuccess: false,
      backendConnectionRequestErrorCount: 0
    });

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
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

  getDropdownItemSelectedHtml(label, clientCount) {
    return (
      <span className="dropdown-toggle-label text-align-left">
        <span className="dropdown-toggle-label-primary">
          {label} per Minute
        </span>
        <span className="dropdown-toggle-label-secondary mute">
          {clientCount} Total {`${StringUtil.pluralize('Client', clientCount)}`}
        </span>
      </span>
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

  getSidePanelContent(clients) {
    return (
      <ClientsTable clients={clients} parentRouter={this.props.parentRouter} />
    );
  }

  getSidePanelHeading(clients) {
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
            items={this.getDropdownItems(clients.getItems().length)}
            onItemSelection={this.handleBackendDetailDropdownChange}
            transition={true}
            transitionName="dropdown-menu"
            wrapperClassName="dropdown dropdown-chart-details" />
        </div>
        <div className="column-3 text-align-right">
          <Tooltip iconClass="icon icon-sprite icon-sprite-mini
            icon-information" behavior="show-tip" tipPlace="top-left"
            content="Lorem ipsum dolor sit amet." />
        </div>
      </div>
    );
  }

  handleBackendDetailDropdownChange(item) {
    this.setState({selectedDropdownItem: item.id});
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
    let backendDetailsHeading;
    let chart;
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
      let clients = backendConnectionDetails.getClients();

      chart = (
        <NetworkItemChart chartData={backendConnectionDetails}
          selectedData={this.state.selectedDropdownItem} />
      );
      content = this.getSidePanelContent(clients);
      backendDetailsHeading = this.getSidePanelHeading(clients);
    }

    return (
      <div className="side-panel-tab-content side-panel-section container
        container-fluid container-pod container-pod-short flex-container-col
        flex-grow">
        {backendDetailsHeading}
        {chart}
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
