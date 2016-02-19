import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import CosmosPackagesStore from '../../stores/CosmosPackagesStore';
import RequestErrorMsg from '../../components/RequestErrorMsg';

class PackageDetailTab extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      descriptionErrorCount: 0,
      isLoading: true
    };

    this.store_listeners = [{
      name: 'cosmosPackages',
      events: ['descriptionError', 'descriptionSuccess'],
      unmountWhen: function (store, event) {
        if (event === 'descriptionSuccess') {
          return !!CosmosPackagesStore.get('packageDetails');
        }
      },
      listenAlways: false
    }];
  }

  componentDidMount() {
    super.componentDidMount(...arguments);

    let {packageName, packageVersion} = this.props.params;
    // Fetch package description
    CosmosPackagesStore.fetchPackageDescription(packageName, packageVersion);
  }

  onCosmosPackagesStoreDescriptionError() {
    this.setState({
      descriptionErrorCount: this.state.descriptionErrorCount + 1
    });
  }

  onCosmosPackagesStoreDescriptionSuccess() {
    this.setState({descriptionErrorCount: 0, isLoading: false});
  }

  handleInstallModalOpen(cosmosPackage) {
    this.setState({installModalPackage: cosmosPackage});
  }

  getContentForLabelAndValue(label, value) {
    if (label === 'Media') {
      return (
        <div className="media-object media-object-spacing flex-box flex-box-wrap">
          {this.getMediaItems(value)}
        </div>
      );
    } else if (typeof value === 'object') {
      return this.getSubItems(value);
    } else {
      return <p className="flush">{value}</p>;
    }
  }

  getErrorScreen() {
    return <RequestErrorMsg />;
  }

  getItems(description) {
    return Object.keys(description).map((label, index) => {
      let value = description[label];
      if (!value || (Array.isArray(value) && !value.length)) {
        return null;
      }

      let contents = this.getContentForLabelAndValue(label, value);

      // Handle objects with null values
      if (!contents || (Array.isArray(contents) && !contents.length)) {
        return null;
      }

      return (
        <div
          className="container-pod container-pod-short-bottom flush-top"
          key={index}>
          <h5 className="inverse flush-top">{label}</h5>
          {contents}
        </div>
      );
    });
  }

  getLicenses(licenses) {
    if (!licenses || (Array.isArray(licenses) && !licenses.length)) {
      return null;
    }

    return licenses.reduce(function (current, license) {
      current[license.name] = (
        <a href={license.url}>{license.url}</a>
      );

      return current;
    }, {});
  }

  getLink(url, prefix = '') {
    if (!url) {
      return null;
    }

    return (
      <a href={`${prefix}${url}`}>{url}</a>
    );
  }

  getMediaItems(items) {
    return items.map(function (url, index) {
      return (
        <div className="media-object-item media-object-item-fill" key={index}>
          <div
            className="media-object-item-fill-image image-rounded-corners"
            style={{backgroundImage: `url(${url})`}} />
        </div>
      );
    });
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

  getSubItems(description) {
    let items = [];
    Object.keys(description).forEach((label, index) => {
      let value = description[label];
      if (value) {
        items.push(
          <p key={index} className="short">{`${label}: `}{value}</p>
        );
      }
    });

    if (!items.length) {
      return null;
    }

    return items;
  }

  render() {
    let {state} = this;

    if (state.packagesErrorCount >= 3) {
      return this.getErrorScreen();
    }

    if (state.isLoading) {
      return this.getLoadingScreen();
    }

    let cosmosPackage = CosmosPackagesStore.get('packageDetails');
    let packageDetails = cosmosPackage.get('package');
    let description = {
      Description: packageDetails.description,
      'Pre-Install Notes': packageDetails.preInstallNotes,
      Information: {
        SCM: this.getLink(packageDetails.scm),
        Maintainer: this.getLink(packageDetails.maintainer, 'mailto:')
      },
      Licenses: this.getLicenses(packageDetails.licenses),
      Media: cosmosPackage.getScreenshots()
    };

    return (
      <div>
        <div className="container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-inverse flush-top">
          <div className="media-object media-object-spacing media-object-align-middle">
            <div className="media-object-item">
              <div className="icon icon-huge icon-image-container icon-app-container">
                <img src={cosmosPackage.getIcons()['icon-large']} />
              </div>
            </div>
            <div className="media-object-item">
              <h1 className="inverse flush">
                {packageDetails.name}
              </h1>
              <p>{packageDetails.version}</p>
              <button
                className="button button-success"
                onClick={this.handleInstallModalOpen.bind(this, cosmosPackage)}>
                Install Package
              </button>
            </div>
          </div>
        </div>
        <div className="container-pod container-pod-short">
          {this.getItems(description)}
        </div>
      </div>
    );
  }
}

module.exports = PackageDetailTab;
