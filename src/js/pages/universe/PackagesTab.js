import mixin from 'reactjs-mixin';
import {Modal} from 'reactjs-components';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import CosmosPackagesStore from '../../stores/CosmosPackagesStore';
import MultipleForm from '../../components/MultipleForm';
import Panel from '../../components/Panel';

const METHODS_TO_BIND = ['handleButtonClick', 'handleAdvancedModalClose'];

class PackagesTab extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      advancedModalOpen: false
    };

    this.store_listeners = [
      {name: 'cosmosPackages', events: ['searchError', 'searchSuccess']}
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    // Get all packages
    CosmosPackagesStore.search();
  }

  handleOpenDetail(pkg, event) {
    event.stopPropagation();
    // Handle open detail view
  }

  handleOpenInstallModal(pkg, event) {
    event.stopPropagation();
    // Handle open install modal
  }

  handleButtonClick() {
    this.setState({advancedModalOpen: true});
  }

  handleAdvancedModalClose() {
    this.setState({advancedModalOpen: false});
  }

  getFooter(pkg) {
    return (
      <button
        className="button button-success"
        onClick={this.handleOpenInstallModal.bind(this, pkg)}>
        Install Package
      </button>
    );
  }

  getHeading(pkg) {
    return (
      <div className="icon icon-jumbo icon-image-container icon-app-container">
        <img src={pkg.getIcons()['icon-large']} />
      </div>
    );
  }

  getPackages() {
    return CosmosPackagesStore.get('search').getItems().map((pkg, index) => {
      return (
        <div
          className="grid-item column-small-6 column-medium-4 column-large-3"
          key={index}>
          <Panel
            className="panel clickable"
            contentClass="panel-content horizontal-center short"
            footer={this.getFooter(pkg)}
            footerClass="panel-footer horizontal-center panel-footer-no-top-border short"
            heading={this.getHeading(pkg)}
            headingClass="panel-heading horizontal-center"
            onClick={this.handleOpenDetail.bind(this, pkg)}>
            <div className="h2 inverse flush-top short-bottom">
              {pkg.get('packageName')}
            </div>
            <p className="inverse flush-bottom">
              {pkg.get('currentVersion')}
            </p>
          </Panel>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="grid row">
        <button
          className="button button-success"
          onClick={this.handleButtonClick}>
          Open Advanced Configuration
        </button><br/>
        {this.getPackages()}
        <Modal
          modalWrapperClass="modal-generic-error"
          modalClass="modal modal-large"
          maxHeightPercentage={0.9}
          onClose={this.handleAdvancedModalClose}
          open={this.state.advancedModalOpen}
          showCloseButton={false}
          showHeader={false}
          showFooter={false}
          titleClass="modal-header-title text-align-center flush">
          <MultipleForm />
        </Modal>
      </div>
    );
  }
}

module.exports = PackagesTab;
