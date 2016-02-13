import _ from 'underscore';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AdvancedConfigModal from '../../components/AdvancedConfigModal';
import CosmosPackagesStore from '../../stores/CosmosPackagesStore';
import Panel from '../../components/Panel';

const METHODS_TO_BIND = [
  'handleAdvancedModalClose',
  'handleAdvancedModalOpen',
  'handleInstallModalClose'
];

class PackagesTab extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      advancedModalOpen: false,
      installModalPackage: false,
      sortProp: 'packageName'
    };

    this.store_listeners = [
      {name: 'cosmosPackages', events: ['availableError', 'availableSuccess']}
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    // Get all packages
    CosmosPackagesStore.fetchAvailablePackages();
  }

  handleDetailOpen(cosmosPackage, event) {
    event.stopPropagation();
    // Handle open detail view
  }

  handleAdvancedModalClose() {
    this.setState({advancedModalOpen: false});
  }

  handleAdvancedModalOpen() {
    this.setState({advancedModalOpen: true});
  }

  handleInstallModalClose() {
    this.setState({installModalPackage: null});
  }

  handleInstallModalOpen(cosmosPackage, event) {
    event.stopPropagation();
    this.setState({installModalPackage: cosmosPackage});
  }

  getFooter(cosmosPackage) {
    return (
      <button
        className="button button-success"
        onClick={this.handleInstallModalOpen.bind(this, cosmosPackage)}>
        Install Package
      </button>
    );
  }

  getHeading(cosmosPackage) {
    return (
      <div className="icon icon-jumbo icon-image-container icon-app-container">
        <img src={cosmosPackage.getIcons()['icon-large']} />
      </div>
    );
  }

  getPackages() {
    let sortProp = this.state.sortProp;
    return _.sortBy(
      CosmosPackagesStore.get('availablePackages').getItems(),
      function (cosmosPackage) {
        return cosmosPackage.get(sortProp);
      }
    )
    .map((cosmosPackage, index) => {
      return (
        <div
          className="grid-item column-small-6 column-medium-4 column-large-3"
          key={index}>
          <Panel
            className="panel clickable"
            contentClass="panel-content horizontal-center short"
            footer={this.getFooter(cosmosPackage)}
            footerClass="panel-footer horizontal-center panel-footer-no-top-border short"
            heading={this.getHeading(cosmosPackage)}
            headingClass="panel-heading horizontal-center"
            onClick={this.handleDetailOpen.bind(this, cosmosPackage)}>
            <div className="h2 inverse flush-top short-bottom">
              {cosmosPackage.get('packageName')}
            </div>
            <p className="inverse flush-bottom">
              {cosmosPackage.get('currentVersion')}
            </p>
          </Panel>
        </div>
      );
    });
  }

  render() {
    let {advancedModalOpen} = this.state;

    return (
      <div className="grid row">
        <button
          className="button button-success"
          onClick={this.handleAdvancedModalOpen}>
          Open Advanced Configuration
        </button><br/>
        <AdvancedConfigModal
          open={advancedModalOpen}
          onClose={this.handleAdvancedModalClose}/>
        {this.getPackages()}
      </div>
    );
  }
}

module.exports = PackagesTab;
