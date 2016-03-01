import _ from 'underscore';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import CosmosPackagesStore from '../../stores/CosmosPackagesStore';
import FilterInputText from '../../components/FilterInputText';
import InstallPackageModal from '../../components/modals/InstallPackageModal';
import Panel from '../../components/Panel';
import RequestErrorMsg from '../../components/RequestErrorMsg';

const METHODS_TO_BIND = [
  'handleInstallModalClose',
  'handleSearchStringChange'
];

class PackagesTab extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      hasError: false,
      installModalPackage: null,
      isLoading: true,
      sortProp: 'name'
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
    CosmosPackagesStore.fetchAvailablePackages();
  }

  onCosmosPackagesStoreAvailableError() {
    this.setState({hasError: true});
  }

  onCosmosPackagesStoreAvailableSuccess() {
    this.setState({hasError: false, isLoading: false});
  }

  handleDetailOpen(cosmosPackage, event) {
    event.stopPropagation();
    this.context.router.transitionTo(
      'universe-packages-detail',
      {packageName: cosmosPackage.get('name')},
      {version: cosmosPackage.get('currentVersion')}
    );
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

  getButton(cosmosPackage) {
    return (
      <button
        className="button button-success"
        onClick={this.handleInstallModalOpen.bind(this, cosmosPackage)}>
        Install Package
      </button>
    );
  }

  getIcon(cosmosPackage) {
    return (
      <div className="icon icon-jumbo icon-image-container icon-app-container">
        <img src={cosmosPackage.getIcons()['icon-medium']} />
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
    let packages = CosmosPackagesStore.getAvailablePackages()
      .filterItems(searchString);

    return _.sortBy(packages.getItems(), function (cosmosPackage) {
      return cosmosPackage.get(sortProp);
    }).map((cosmosPackage, index) => {
      return (
        <div
          className="grid-item column-mini-6 column-medium-4 column-large-3"
          key={index}>
          <Panel
            className="panel clickable"
            contentClass="panel-content horizontal-center"
            footer={this.getButton(cosmosPackage)}
            footerClass="panel-footer horizontal-center panel-footer-no-top-border flush-top"
            onClick={this.handleDetailOpen.bind(this, cosmosPackage)}>
            {this.getIcon(cosmosPackage)}
            <div className="h2 inverse short">
              {cosmosPackage.get('name')}
            </div>
            <p className="inverse flush">
              {cosmosPackage.get('currentVersion')}
            </p>
          </Panel>
        </div>
      );
    });
  }

  render() {
    let {state} = this;
    let packageName, packageVersion;

    if (state.installModalPackage) {
      packageName = state.installModalPackage.get('name');
      packageVersion = state.installModalPackage.get('currentVersion');
    }

    if (state.hasError) {
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
        </div>
        <div className="grid row">
          {this.getPackages()}
        </div>
        <InstallPackageModal
          open={!!state.installModalPackage}
          packageName={packageName}
          packageVersion={packageVersion}
          onClose={this.handleInstallModalClose}/>
      </div>
    );
  }
}

PackagesTab.contextTypes = {
  router: React.PropTypes.func
};

module.exports = PackagesTab;
