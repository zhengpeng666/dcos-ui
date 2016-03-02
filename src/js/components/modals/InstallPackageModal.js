import classNames from 'classnames';
import mixin from 'reactjs-mixin';
import {Form, Modal} from 'reactjs-components';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AdvancedConfigModal from '../AdvancedConfigModal';
import CosmosMessages from '../../constants/CosmosMessages';
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

class InstallPackageModal extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      advancedModalOpen: false,
      appId: null,
      installError: null,
      isLoading: true,
      isReviewing: false,
      nameError: null,
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

  componentDidMount() {
    super.componentDidMount(...arguments);
    let {props} = this;
    if (props.open) {
      CosmosPackagesStore.fetchPackageDescription(
        props.packageName,
        props.packageVersion
      );
    }
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);
    let {props} = this;
    if (prevProps.open && !props.open) {
      this.setState({
        advancedModalOpen: false,
        appId: null,
        installError: null,
        isLoading: true,
        isReviewing: false,
        nameError: null,
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

  onCosmosPackagesStoreDescriptionError(nameError) {
    this.setState({appId: null, nameError});
  }

  onCosmosPackagesStoreDescriptionSuccess() {
    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let {name} = cosmosPackage.get('package');
    let appId = Util.findNestedPropertyInObject(
      cosmosPackage.get('config'),
      `properties.${name}.properties.framework-name.default`
    ) || `${name}-default`;

    // Store appId from package
    this.setState({
      appId: appId,
      hasError: false,
      isLoading: false
    });
  }

  onCosmosPackagesStoreInstallError(installError) {
    this.setState({
      installError,
      packageInstalled: false,
      pendingRequest: false
    });
  }

  onCosmosPackagesStoreInstallSuccess() {
    this.setState({
      installError: null,
      packageInstalled: true,
      pendingRequest: false
    });
  }

  handleAdvancedModalClose() {
    this.setState({advancedModalOpen: false});
  }

  handleAdvancedModalOpen() {
    this.setState({
      advancedModalOpen: true,
      installError: null,
      pendingRequest: false
    });
  }

  handleChangeAppId(definition) {
    this.setState({installError: null, appId: definition.appId});
  }

  handleChangeReviewState(isReviewing) {
    this.setState({installError: null, isReviewing});
  }

  handleInstallPackage(cosmosPackage) {
    let {appId} = this.state;
    CosmosPackagesStore.installPackage(
      cosmosPackage.get('package').name,
      cosmosPackage.get('package').version,
      appId,
      {[cosmosPackage.get('package').name]: {'framework-name': appId}}
    );

    this.setState({pendingRequest: true});
  }

  getAdvancedLink() {
    let {installError, isReviewing, packageInstalled, pendingRequest} = this.state;
    if (isReviewing || packageInstalled || pendingRequest) {
      return null;
    }

    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let buttonClasses = classNames('button', {
      'button-link button-primary clickable': !installError,
      'button-wide': installError
    });
    let buttonText = 'Advanced Installation';
    if (installError) {
      buttonText = 'Edit Configuration';
    }

    return (
      <div className="button-collection horizontal-center">
        <button
          disabled={!cosmosPackage || pendingRequest}
          className={buttonClasses}
          onClick={this.handleAdvancedModalOpen}>
          {buttonText}
        </button>
      </div>
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
      validation: /^\/?(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$/g,
      validationErrorText: (
        'Name contains invalid characters (allowed: lowercase letters, digits, hyphens, ".", "..")'
      ),
      writeType: 'edit'
    }];
  }

  getBackButton() {
    if (!this.state.isReviewing) {
      return null;
    }

    return (
      <button
        className="button button-large flush"
        onClick={this.handleChangeReviewState.bind(this, false)}>
        Back
      </button>
    );
  }

  getFooter() {
    return (
      <div className="text-align-center flush-bottom">
        {this.getReviewConfigButton()}
        <div className="button-collection flush">
          {this.getBackButton()}
          {this.getInstallButton()}
        </div>
        {this.getAdvancedLink()}
      </div>
    );
  }

  getInstallButton() {
    let {
      installError,
      isReviewing,
      packageInstalled,
      pendingRequest
    } = this.state;

    if (installError || isReviewing) {
      return null;
    }

    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
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
      'button-wide': !installError
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

  getInstallError() {
    let {installError} = this.state;
    if (!installError) {
      return null;
    }

    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let name = cosmosPackage.get('package').name || 'this package';
    let installErrorMessage = CosmosMessages[installError.type] ||
      CosmosMessages.default;
    if (installError) {
      return (
        <div className="horizontal-center">
          <h4 className="text-danger">{installErrorMessage.header}</h4>
          <p className="text-align-center">
            {installErrorMessage.getMessage(name)}
          </p>
        </div>
      );
    }
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

  getModalContents() {
    let {state} = this;
    let cosmosPackage = CosmosPackagesStore.getPackageDetails();

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
          jsonDocument={jsonDocument} />
      );
    }

    return (
      <div>
        {this.getInstallError()}
        {this.getPackageInfo()}
        {this.getPostInstallNotes()}
      </div>
    );
  }

  getPackageInfo() {
    let {nameError, installError, isReviewing, packageInstalled} =
      this.state;
    if (installError || isReviewing || packageInstalled) {
      return null;
    }

    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let {name, version} = cosmosPackage.get('package');

    let error;
    if (nameError) {
      error = (
        <p className="text-danger text-small text-align-center">
          {nameError}
        </p>
      );
    }

    return (
      <div className="horizontal-center">
        <div className="icon icon-jumbo icon-image-container icon-app-container">
          <img src={cosmosPackage.getIcons()['icon-large']} />
        </div>
        <Form definition={this.getAppIdFormData()}
            onSubmit={this.handleChangeAppId} />
        <p className="flush-bottom">{`${name} ${version}`}</p>
        {error}
      </div>
    );
  }

  getPostInstallNotes() {
    let {isReviewing, packageInstalled} = this.state;
    if (isReviewing || !packageInstalled) {
      return null;
    }

    let notes = Util.findNestedPropertyInObject(
      CosmosPackagesStore.getPackageDetails().get('package'),
      'postInstallNotes'
    );

    let parsedNotes = StringUtil.parseMarkdown(notes);

    return (
      <div className="horizontal-center">
        <h2 className="flush">Success!</h2>
        <div
          className="container-pod container-pod-short-top flush-bottom text-align-center"
          style={{width: '100%', overflow: 'auto', wordWrap: 'break-word'}}
          dangerouslySetInnerHTML={parsedNotes} />
      </div>
    );
  }

  getReviewConfigButton() {
    let {installError, isReviewing, packageInstalled, pendingRequest} = this.state;
    if (installError || isReviewing || packageInstalled || pendingRequest) {
      return null;
    }

    return (
      <div className="button-collection horizontal-center">
        <button
          disabled={!CosmosPackagesStore.getPackageDetails()}
          className="button button-mini button-stroke button-rounded"
          onClick={this.handleChangeReviewState.bind(this, true)}>
          View Configuration Details
        </button>
      </div>
    );
  }

  getReviewHeader() {
    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
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
          footer={this.getFooter()}
          modalClass={modalClasses}
          modalWrapperClass={modalWrapperClasses}
          open={props.open}
          onClose={props.onClose}
          showCloseButton={false}
          showFooter={true}
          showHeader={state.isReviewing}
          headerClass="modal-header modal-header-bottom-border modal-header-white"
          innerBodyClass={modalBodyClasses}
          subHeader={this.getReviewHeader()}>
          {this.getModalContents()}
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
