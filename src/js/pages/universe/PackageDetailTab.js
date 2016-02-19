import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import CosmosPackagesStore from '../../stores/CosmosPackagesStore';
import RequestErrorMsg from '../../components/RequestErrorMsg';
import StringUtil from '../../utils/StringUtil';

class PackageDetailTab extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      hasError: 0,
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
      hasError: true
    });
  }

  onCosmosPackagesStoreDescriptionSuccess() {
    this.setState({hasError: false, isLoading: false});
  }

  handleInstallModalOpen(cosmosPackage) {
    this.setState({installModalPackage: cosmosPackage});
  }

  getErrorScreen() {
    return <RequestErrorMsg />;
  }

  getItems(definition, renderItem) {
    let items = [];
    Object.keys(definition).forEach((label, index) => {
      let value = definition[label];

      if (!value || (Array.isArray(value) && !value.length)) {
        return null;
      }

      let content = value;

      if (typeof value === 'object') {
        content = this.getItems(value, this.getSubItem);
      }

      // Specific render method for media
      if (label === 'Media') {
        content = (
          <div
            className="media-object media-object-spacing flex-box flex-box-wrap"
            key={index}>
            {this.getItems(value, this.getMediaItem)}
          </div>
        );
      }

      items.push(renderItem(label, content, index));

    });

    if (!items.length) {
      return null;
    }

    return items;
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

  getLicenses(licenses) {
    if (!Array.isArray(licenses)) {
      return null;
    }

    return licenses.reduce(function (current, license) {
      current[license.name] = license.url;

      return current;
    }, {});
  }

  getItem(label, value, key) {
    if (!label || !value) {
      return null;
    }

    if (typeof value === 'string') {
      value = <p className="flush">{value}</p>;
    }

    return (
      <div
        className="container-pod container-pod-short-bottom flush-top"
        key={key}>
        <h5 className="inverse flush-top">{label}</h5>
        {value}
      </div>
    );
  }

  getMediaItem(label, value, key) {
    return (
      <div className="media-object-item media-object-item-fill" key={key}>
        <div
          className="media-object-item-fill-image image-rounded-corners"
          style={{backgroundImage: `url(${value})`}} />
      </div>
    );
  }

  getSubItem(label, value, key) {
    let content = value;

    if (StringUtil.isEmail(value)) {
      content = <a key={key} href={`mailto:${value}`}>{value}</a>;
    }

    if (StringUtil.isUrl(value)) {
      content = <a key={key} href={value}>{value}</a>;
    }

    return (
      <p key={key} className="short">{`${label}: `}{content}</p>
    );
  }

  render() {
    let {state} = this;

    if (state.hasError) {
      return this.getErrorScreen();
    }

    if (state.isLoading) {
      return this.getLoadingScreen();
    }

    let cosmosPackage = CosmosPackagesStore.get('packageDetails');
    let packageDetails = cosmosPackage.get('package');
    let definition = {
      Description: packageDetails.description,
      'Pre-Install Notes': packageDetails.preInstallNotes,
      Information: {
        SCM: packageDetails.scm,
        Maintainer: packageDetails.maintainer
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
          {this.getItems(definition, this.getItem)}
        </div>
      </div>
    );
  }
}

module.exports = PackageDetailTab;
