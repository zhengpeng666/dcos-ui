import _ from 'underscore';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AdvancedConfigModal from '../../components/AdvancedConfigModal';
import CosmosPackagesStore from '../../stores/CosmosPackagesStore';
import FilterInputText from '../../components/FilterInputText';
import Panel from '../../components/Panel';
import RequestErrorMsg from '../../components/RequestErrorMsg';

const METHODS_TO_BIND = [
  'handleAdvancedModalClose',
  'handleAdvancedModalOpen',
  'handleInstallModalClose',
  'handleSearchStringChange'
];

class PackagesTab extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      advancedModalOpen: false,
      installModalPackage: false,
      isLoading: true,
      packagesErrorCount: 0,
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

  onCosmosPackagesStoreAvailableError() {
    this.setState({packagesErrorCount: this.state.packagesErrorCount + 1});
  }

  onCosmosPackagesStoreAvailableSuccess() {
    this.setState({packagesErrorCount: 0, isLoading: false});
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

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  getErrorScreen() {
    return <RequestErrorMsg />;
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

  getLoadingScreen() {
    return (
      <div className="container-pod text-align-center vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getPackages() {
    let {searchString, sortProp} = this.state;
    let packages = CosmosPackagesStore.get('availablePackages')
      .filterItems(searchString);

    return _.sortBy(packages.getItems(), function (cosmosPackage) {
      return cosmosPackage.get(sortProp);
    }).map((cosmosPackage, index) => {
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
    let {state} = this;

    if (state.packagesErrorCount >= 3) {
      return this.getErrorScreen();
    }

    if (state.isLoading) {
      return this.getLoadingScreen();
    }

    return (
      <div>
        <div className="control-group form-group flex-no-shrink flex-align-right flush-bottom">
          <FilterInputText
            className="flex-grow"
            placeholder="Search"
            searchString={state.searchString}
            handleFilterChange={this.handleSearchStringChange}
            inverseStyle={true} />
          <button
            className="button button-success"
            onClick={this.handleAdvancedModalOpen}>
            Open Advanced Configuration
          </button>
        </div>
        <div className="grid row">
          {this.getPackages()}
        </div>
        <AdvancedConfigModal
          open={state.advancedModalOpen}
          onClose={this.handleAdvancedModalClose}/>
      </div>
    );
  }
}

module.exports = PackagesTab;
