import classNames from 'classnames';
import mixin from 'reactjs-mixin';
import {Form, Modal} from 'reactjs-components';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AdvancedConfigModal from '../AdvancedConfigModal';
import CosmosPackagesStore from '../../stores/CosmosPackagesStore';
import ReviewConfig from '../ReviewConfig';
import SchemaUtil from '../../utils/SchemaUtil';
import StringUtil from '../../utils/StringUtil';
import Util from '../../utils/Util';

const METHODS_TO_BIND = [
  'handleAdvancedModalClose',
  'handleAdvancedModalOpen',
  'handleChangeAppId',
  'handleChangeReviewState',
  'handleInstallPackage'
];

const RESOURCE_DISPLAY_CONFIG = [
  {label: 'CPUs', propertyPath: 'cpus.default'},
  {label: 'MEM', propertyPath: 'mem.default'},
  {label: 'DISK', propertyPath: 'disk.default'}
];

class InstallPackageModal extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      advancedModalOpen: false,
      appId: null,
      errorMessage: null,
      installErrorMessage: null,
      isLoading: true,
      isReviewing: false,
      packageInstalled: false,
      pendingRequest: false
    };

    this.store_listeners = [{
      name: 'cosmosPackages',
      events: [
        'descriptionSuccess',
        'descriptionError',
        'installError',
        'installSuccess'
      ]
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);
    let {props} = this;
    if (prevProps.open && !props.open) {
      this.setState({
        advancedModalOpen: false,
        appId: null,
        errorMessage: null,
        installErrorMessage: null,
        isLoading: true,
        isReviewing: false,
        packageInstalled: false
      });
    }

    if (!prevProps.open && props.open) {
      CosmosPackagesStore.fetchPackageDescription(
        props.packageName,
        props.packageVersion
      );
    }
  }

  onCosmosPackagesStoreDescriptionError(errorMessage) {
    this.setState({appId: null, errorMessage});
  }

  onCosmosPackagesStoreDescriptionSuccess() {
    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let {name} = cosmosPackage.get('package');
    let appId = Util.findNestedPropertyInObject(
      cosmosPackage.get('config'),
      `properties.${name}.properties.framework-name.default`
    ) || `${name}`;

    // Store appId from package
    this.setState({
      appId: `${appId}-default`,
      hasError: false,
      isLoading: false
    });
  }

  onCosmosPackagesStoreInstallError(installErrorMessage) {
    this.setState({
      installErrorMessage,
      packageInstalled: false,
      pendingRequest: false
    });
  }

  onCosmosPackagesStoreInstallSuccess() {
    this.setState({
      installErrorMessage: null,
      packageInstalled: true,
      pendingRequest: false
    });
  }

  handleAdvancedModalClose() {
    this.setState({advancedModalOpen: false});
  }

  handleAdvancedModalOpen() {
    this.setState({advancedModalOpen: true});
  }

  handleChangeAppId(definition) {
    let {installErrorMessage} = this.state;
    this.setState({appId: definition.appId, installErrorMessage});
  }

  handleChangeReviewState(isReviewing) {
    this.setState({installErrorMessage: null, isReviewing});
  }

  handleInstallPackage(cosmosPackage) {
    CosmosPackagesStore.installPackage(
      cosmosPackage.get('package').name,
      cosmosPackage.get('package').version,
      this.state.appId,
      cosmosPackage.get('config')
    );

    this.setState({pendingRequest: true});
  }

  getAdvancedLink(cosmosPackage) {
    if (this.state.isReviewing) {
      return null;
    }

    return (
      <p className="flush-bottom">
        <a
          className="clickable"
          disabled={!cosmosPackage}
          onClick={this.handleAdvancedModalOpen}>
          Advanced Installation
        </a>
      </p>
    );
  }

  getAppIdFormData() {
    return [{
      fieldType: 'text',
      name: 'appId',
      value: this.state.appId,
      required: true,
      sharedClass: 'form-element-inline h2 short',
      inputClass: 'form-control text-align-center',
      helpBlockClass: 'form-help-block text-align-center',
      showLabel: false,
      validation: /^[a-z0-9\-\.\/]+$/g,
      validationErrorText: (
        'Name contains invalid characters (allowed: lowercase letters, digits, hyphens, ".", "..")'
      ),
      writeType: 'edit'
    }];
  }

  getFooter(cosmosPackage) {
    // TODO: {this.getConfigResources(cosmosPackage)}
    return (
      <div className="text-align-center flush-bottom">
        {this.getReviewConfigButton(cosmosPackage)}
        <div className="button-collection">
          {this.getBackButton(cosmosPackage)}
          {this.getInstallButton(cosmosPackage)}
        </div>
        {this.getAdvancedLink(cosmosPackage)}
      </div>
    );
  }

  getConfigResources(cosmosPackage) {
    if (!cosmosPackage || this.state.isReviewing) {
      return null;
    }

    let configProps = Util.findNestedPropertyInObject(
      cosmosPackage.get('config'),
      `properties.${cosmosPackage.get('package').name}.properties`
    );

    let items = RESOURCE_DISPLAY_CONFIG.map(function (item, index) {
      let value = Util.findNestedPropertyInObject(
        configProps,
        item.propertyPath
      );

      if (!value) {
        return null;
      }

      return (
        <div key={index}>
          <div>{item.label}</div>
          <div>{value}</div>
        </div>
      );
    });

    return (
      <div>
        {items}
      </div>
    );
  }

  getBackButton(cosmosPackage) {
    let {installErrorMessage, isReviewing, pendingRequest} = this.state;
    if (!isReviewing && !installErrorMessage) {
      return null;
    }

    let buttonAction = this.handleChangeReviewState.bind(this, false);
    let buttonClasses = classNames({
      'button': true,
      'button-large': isReviewing
    });
    let buttonText = 'Back';
    if (installErrorMessage) {
      buttonAction = this.handleChangeReviewState.bind(this, true);
      buttonText = 'Edit Configuration';
    }

    return (
      <button
        disabled={!cosmosPackage || pendingRequest}
        className={buttonClasses}
        onClick={buttonAction}>
        {buttonText}
      </button>
    );
  }

  getInstallButton(cosmosPackage) {
    let {
      installErrorMessage,
      isReviewing,
      packageInstalled,
      pendingRequest
    } = this.state;

    if (isReviewing) {
      return null;
    }

    let buttonAction = this.handleInstallPackage.bind(this, cosmosPackage);
    let buttonText = 'Install';
    if (pendingRequest) {
      buttonText = 'Installing...';
    }

    if (packageInstalled) {
      buttonAction = this.props.onClose;
      buttonText = (
        <i className="icon icon-sprite icon-sprite-mini icon-sprite-mini-white icon-check-mark" />
      );
    }

    let buttonClasses = classNames({
      'button button-success': true,
      'button-wide': !installErrorMessage
    });

    return (
      <button
        disabled={!cosmosPackage || pendingRequest}
        className={buttonClasses}
        onClick={buttonAction}>
        {buttonText}
      </button>
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

  getPostInstallNotes(cosmosPackage) {
    let {isReviewing, packageInstalled} = this.state;
    if (isReviewing || !packageInstalled) {
      return null;
    }

    let notes = Util.findNestedPropertyInObject(
      cosmosPackage.get('package'),
      'postInstallNotes'
    );

    let parsedNotes = StringUtil.parseMarkdown(notes);

    if (!parsedNotes) {
      return null;
    }

    return (
      <div
        className="container-pod container-pod-short-top flush-bottom text-align-center"
        style={{width: '100%', overflow: 'auto', wordWrap: 'break-word'}}
        dangerouslySetInnerHTML={parsedNotes} />
    );
  }

  getReviewConfigButton(cosmosPackage) {
    if (this.state.isReviewing) {
      return null;
    }

    return (
      <div className="button-collection horizontal-center">
        <button
          disabled={!cosmosPackage}
          className="button button-mini button-stroke button-rounded"
          onClick={this.handleChangeReviewState.bind(this, true)}>
          View Configuration Details
        </button>
      </div>
    );
  }

  getReviewHeader(cosmosPackage) {
    let {name, version} = cosmosPackage.get('package');

    return (
      <div>
        <div className="column-4">
          <div className="media-object-spacing-wrapper media-object-spacing-narrow">
            <div className="media-object media-object-align-middle">
              <div className="media-object-item">
                <img
                  className="icon icon-sprite icon-sprite-medium icon-sprite-medium-color icon-image-container icon-app-container"
                  src={cosmosPackage.getIcons()['icon-small']} />
              </div>
              <div className="media-object-item">
                <h4 className="flush-top flush-bottom text-color-neutral">
                  {name}
                </h4>
                <span className="side-panel-resource-label">
                  {version}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="column-8 text-align-right">
          <button className="button button-stroke button-rounded">
            Download config.json
          </button>
        </div>
      </div>
    );
  }

  getModalContents(cosmosPackage) {
    let {state} = this;

    let error;

    if (state.errorMessage) {
      error = (
        <p className="form-help-block text-danger">{state.errorMessage}</p>
      );
    }

    let installError;

    if (state.installErrorMessage) {
      installError = (
        <p className="h4 text-danger">{state.installErrorMessage}</p>
      );
    }

    if (state.isLoading || !cosmosPackage) {
      return this.getLoadingScreen();
    }

    let config = cosmosPackage.get('config');
    if (state.isReviewing) {
      let jsonDocument = SchemaUtil.definitionToJSONDocument(
        SchemaUtil.schemaToMultipleDefinition(config)
      );

      return (
        <ReviewConfig
          jsonDocument={jsonDocument}/>
      );
    }

    let {name, version} = cosmosPackage.get('package');
    return (
      <div className="horizontal-center">
        {installError}
        <div className="icon icon-jumbo icon-image-container icon-app-container">
          <img src={cosmosPackage.getIcons()['icon-large']} />
        </div>
        {this.getPostInstallNotes(cosmosPackage)}
        <Form definition={this.getAppIdFormData()}
            onSubmit={this.handleChangeAppId} />
        <p className="flush-bottom">{`${name} ${version}`}</p>
        {error}
      </div>
    );
  }

  render() {
    let {props, state} = this;
    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let modalClasses = classNames('modal', {
      'modal-large': state.isReviewing,
      'modal-narrow': !state.isReviewing
    });

    let modalWrapperClasses = classNames({
      'multiple-form-modal': state.isReviewing
    });

    let modalBodyClasses = classNames({
      'modal-content-inner container container-pod container-pod-short': true,
      'flush-top flush-bottom': state.isReviewing
    });

    if (!cosmosPackage) {
      return null;
    }

    let multipleDefinition = SchemaUtil.schemaToMultipleDefinition(
      cosmosPackage.get('config')
    );

    return (
      <div>
        <Modal
          footer={this.getFooter(cosmosPackage)}
          modalClass={modalClasses}
          modalWrapperClass={modalWrapperClasses}
          open={props.open}
          onClose={props.onClose}
          showCloseButton={false}
          showFooter={true}
          showHeader={state.isReviewing}
          headerClass="modal-header modal-header-white"
          innerBodyClass={modalBodyClasses}
          subHeader={this.getReviewHeader(cosmosPackage)}>
          {this.getModalContents(cosmosPackage)}
        </Modal>
        <AdvancedConfigModal
          open={state.advancedModalOpen}
          onClose={this.handleAdvancedModalClose}
          multipleDefinition={multipleDefinition} />
      </div>
    );
  }
}

InstallPackageModal.defaultProps = {
  onClose: function () {},
  open: false
};

InstallPackageModal.propTypes = {
  packageName: React.PropTypes.string,
  packageVersion: React.PropTypes.string,
  open: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};

module.exports = InstallPackageModal;
