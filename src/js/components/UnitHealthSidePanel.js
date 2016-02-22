import mixin from 'reactjs-mixin';
import React from 'react';
import {SidePanel} from 'reactjs-components';
import {StoreMixin} from 'mesosphere-shared-reactjs';
import HistoryStore from '../stores/HistoryStore';
import MesosSummaryStore from '../stores/MesosSummaryStore';
import UnitHealthSidePanelContents from './UnitHealthSidePanelContents';

const METHODS_TO_BIND = [
  'handlePanelClose'
];

class UnitHealthSidePanel extends mixin(StoreMixin) {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    this.store_listeners = [
      {name: 'unitHealth', events: ['success', 'error' ]}
    ];
  }

  handlePanelClose(closeInfo) {
    if (!this.isOpen()) {
      return;
    }

    if (closeInfo && closeInfo.closedByBackdrop) {
      HistoryStore.goBackToPage(this.context.router);
      return;
    }

    HistoryStore.goBack(this.context.router);
  }

  isOpen() {
    return (
      this.props.params.unitID != null
      && MesosSummaryStore.get('statesProcessed')
    );
  }

  getHeader() {
    return (
      <div className="side-panel-header-container">
        <div className="side-panel-header-actions
          side-panel-header-actions-primary">
          <span className="side-panel-header-action"
            onClick={this.handlePanelClose}>
            <i className={`icon icon-sprite icon-sprite-small icon-close
              icon-sprite-small-white`}></i>
            Close
          </span>
        </div>
      </div>
    );
  }

  getContents(unitID) {
    if (!this.isOpen()) {
      return null;
    }

    return (
      <UnitHealthSidePanelContents
        itemID={unitID}
        parentRouter={this.context.router} />
    );
  }

  render() {
    let unitID = 'unit';

    return (
      <div>
        <SidePanel className="side-panel-detail"
          header={this.getHeader()}
          headerContainerClass="container
            container-fluid container-fluid-narrow container-pod
            container-pod-short"
          bodyClass="side-panel-content flex-container-col"
          onClose={this.handlePanelClose}
          open={this.isOpen()}>
          {this.getContents(unitID)}
        </SidePanel>
      </div>
    );
  }
}

UnitHealthSidePanel.contextTypes = {
  router: React.PropTypes.func
};

UnitHealthSidePanel.propTypes = {
  params: React.PropTypes.object
};

module.exports = UnitHealthSidePanel;
