import _ from 'underscore';
import {Confirm, SidePanel} from 'reactjs-components';
import mixin from 'reactjs-mixin';
import React from 'react';

import BackendDetailSidePanelContents from './BackendDetailSidePanelContents';
import HistoryStore from '../../../src/js/stores/HistoryStore';
import MesosSummaryStore from '../../../src/js/stores/MesosSummaryStore';
import StringUtil from '../../../src/js/utils/StringUtil';
import VIPDetailSidePanelContents from './VIPDetailSidePanelContents';

let SDK = require('../SDK').getSDK();

const METHODS_TO_BIND = [
  'handlePanelClose'
];

class NetworkSidePanel extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  handlePanelClose(closeInfo) {
    if (!this.isOpen()) {
      return;
    }

    let router = this.context.router;

    if (closeInfo && closeInfo.closedByBackdrop) {
      router.transitionTo(this.props.openedPage, router.getCurrentParams());
      return;
    }

    SDK.Hooks.doAction('goBack', router);
  }

  isOpen() {
    return this.props.vip != null && SDK.Store.getAppState()
    .summary.statesProcessed;
  }

  getHeader() {
    let text = 'back';
    let prevPage = HistoryStore.getHistoryAt(-1);

    if (prevPage == null) {
      text = 'close';
    }

    if (prevPage) {
      let matchedRoutes = this.context.router.match(prevPage).routes;
      prevPage = _.last(matchedRoutes).name;

      if (this.props.openedPage === prevPage) {
        text = 'close';
      }
    }

    return (
      <div className="side-panel-header-actions
        side-panel-header-actions-primary">
        <span className="side-panel-header-action"
          onClick={this.handlePanelClose}>
          <i className={`icon icon-sprite
            icon-sprite-small
            icon-${text}
            icon-sprite-small-white`}></i>
          {StringUtil.capitalize(text)}
        </span>
      </div>
    );
  }

  getContents(props) {
    if (!this.isOpen()) {
      return null;
    }

    let currentRoutes = this.context.router.getCurrentRoutes();
    let activeRoute = currentRoutes[currentRoutes.length - 1].name;
    let {vip, port, protocol} = props;

    if (activeRoute === 'backend-detail-panel') {
      return (
        <BackendDetailSidePanelContents port={port} vip={vip}
          protocol={protocol} parentRouter={this.context.router} />
      );
    } else if (activeRoute === 'vip-detail-panel') {
      return (
        <VIPDetailSidePanelContents port={port} vip={vip} protocol={protocol}
          parentRouter={this.context.router} />
      );
    }

    return null;
  }

  render() {
    let {vip, port, protocol} = this.props;

    return (
      <div>
        <SidePanel className="side-panel-detail"
          header={this.getHeader(vip, port, protocol)}
          headerContainerClass="container container-fluid container-fluid-narrow
            container-pod container-pod-short"
          bodyClass="side-panel-content flex-container-col"
          onClose={this.handlePanelClose}
          open={this.isOpen()}>
          {this.getContents(this.props)}
        </SidePanel>
      </div>
    );
  }
}

NetworkSidePanel.contextTypes = {
  router: React.PropTypes.func
};

NetworkSidePanel.propTypes = {
  vip: React.PropTypes.string,
  protocol: React.PropTypes.string,
  port: React.PropTypes.string
};

module.exports = NetworkSidePanel;
