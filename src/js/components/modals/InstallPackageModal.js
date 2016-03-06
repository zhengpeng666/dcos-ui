import classNames from 'classnames';
import {Form, Modal} from 'reactjs-components';
import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AdvancedConfig from '../AdvancedConfig';
import CosmosMessages from '../../constants/CosmosMessages';
import CosmosPackagesStore from '../../stores/CosmosPackagesStore';
import InternalStorageMixin from '../../mixins/InternalStorageMixin';
import ReviewConfig from '../ReviewConfig';
import SchemaUtil from '../../utils/SchemaUtil';
import StringUtil from '../../utils/StringUtil';
import Util from '../../utils/Util';

const METHODS_TO_BIND = [
  'getAdvancedSubmit',
  'handleChangeAppId',
  'handleChangeCurrentState',
  'handleInstallPackage'
];

const INSTALL_STATES = {
  defaultInstall: 0,
  reviewDefaultConfig: 1,
  advancedInstall: 2,
  reviewAdvancedConfig: 3,
  packageInstalled: 4
};

class InstallPackageModal extends mixin(InternalStorageMixin, StoreMixin) {
  constructor() {
    super();

    this.internalStorage_set({
      appId: null,
      currentState: INSTALL_STATES.defaultInstall,
      descriptionError: null,
      installError: null,
      isLoading: true,
      pendingRequest: false
    });

    this.store_listeners = [{
      name: 'cosmosPackages',
      events: [
        'descriptionError',
        'descriptionSuccess',
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

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(...arguments);
    let {props} = this;
    if (props.open && !nextProps.open) {
      this.internalStorage_set({
        appId: null,
        currentState: INSTALL_STATES.defaultInstall,
        descriptionError: null,
        installError: null,
        isLoading: true,
        pendingRequest: false
      });
    }

    if (!props.open && nextProps.open) {
      CosmosPackagesStore.fetchPackageDescription(
        nextProps.packageName,
        nextProps.packageVersion
      );
      this.setState({transitionName: 'modal'});
    }

    if (props.open === nextProps.open) {
      this.setState({transitionName: 'flip'});
    }
  }

  onCosmosPackagesStoreDescriptionError(descriptionError) {
    this.internalStorage_update({appId: null, descriptionError});
    this.forceUpdate();
  }

  onCosmosPackagesStoreDescriptionSuccess() {
    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let {name} = cosmosPackage.get('package');
    let appId = Util.findNestedPropertyInObject(
      cosmosPackage.get('config'),
      `properties.${name}.properties.framework-name.default`
    ) || `${name}-default`;

    // Store appId from package
    this.internalStorage_update({
      appId: appId,
      hasError: false,
      isLoading: false
    });
    this.forceUpdate();
  }

  onCosmosPackagesStoreInstallError(installError) {
    this.internalStorage_update({
      currentState: INSTALL_STATES.defaultInstall,
      installError,
      pendingRequest: false
    });
    this.forceUpdate();
  }

  onCosmosPackagesStoreInstallSuccess() {
    this.internalStorage_update({
      currentState: INSTALL_STATES.packageInstalled,
      installError: null,
      pendingRequest: false
    });
    this.forceUpdate();
  }

  handleChangeAppId(definition) {
    this.internalStorage_update({installError: null, appId: definition.appId});
    this.forceUpdate();
  }

  handleChangeCurrentState(currentState) {
    this.internalStorage_update({installError: null, currentState});
    this.forceUpdate();
  }

  handleInstallPackage() {
    let {name, version} = CosmosPackagesStore.getPackageDetails().get('package');
    let {appId, configuration} = this.getAppIdAndConfiguration();
    CosmosPackagesStore.installPackage(name, version, appId, configuration);
    this.internalStorage_update({pendingRequest: true});
    this.forceUpdate();
  }

  getAdvancedButton() {
    let {
      currentState,
      installError,
      pendingRequest
    } = this.internalStorage_get();
    let {advancedInstall, defaultInstall} = INSTALL_STATES;
    if (currentState !== defaultInstall) {
      return null;
    }

    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let buttonClasses = classNames('button flush-bottom', {
      'button-link button-primary clickable': !installError,
      'button-wide': installError
    });
    let buttonText = 'Advanced Installation';
    if (installError) {
      buttonText = 'Edit Configuration';
    }

    return (
      <button
        disabled={!cosmosPackage || pendingRequest}
        className={buttonClasses}
        onClick={this.handleChangeCurrentState.bind(this, advancedInstall)}>
        {buttonText}
      </button>
    );
  }

  getAdvancedConfig() {
    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    if (!cosmosPackage) {
      return null;
    }

    let {currentState} = this.internalStorage_get();
    let classSet = classNames({
      hidden: currentState !== INSTALL_STATES.advancedInstall
    });

    let {name, version} = cosmosPackage.get('package');

    return (
      <AdvancedConfig
        className={classSet}
        packageIcon={cosmosPackage.getIcons()['icon-small']}
        packageName={name}
        packageVersion={version}
        schema={cosmosPackage.get('config')}
        getTriggerSubmit={this.getAdvancedSubmit} />
    );
  }

  getAdvancedFooter() {
    let {currentState} = this.internalStorage_get();
    if (currentState !== INSTALL_STATES.advancedInstall) {
      return null;
    }

    return (
      <div className="button-collection flush-bottom">
        {this.getBackButton()}
        {this.getReviewButton()}
        {this.getInstallButton()}
      </div>
    );
  }

  getAdvancedSubmit(triggerSubmit) {
    this.triggerAdvancedSubmit = triggerSubmit;
  }

  getAppIdFormDefinition() {
    return [{
      fieldType: 'text',
      name: 'appId',
      value: this.internalStorage_get().appId,
      required: true,
      sharedClass: 'form-element-inline h2 short',
      inputClass: 'form-control text-align-center',
      helpBlockClass: 'form-help-block text-align-center',
      showLabel: false,
      validation: /^\/?(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$/g,
      validationErrorText: (
        'Names can include lowercase letters, digits, hyphens, "." and ","'
      ),
      writeType: 'edit'
    }];
  }

  getBackButton() {
    let {currentState} = this.internalStorage_get();
    let {
      advancedInstall,
      defaultInstall,
      reviewAdvancedConfig
    } = INSTALL_STATES;

    let newState = defaultInstall;
    if (currentState === advancedInstall) {
      newState = defaultInstall;
    }
    if (currentState === reviewAdvancedConfig) {
      newState = advancedInstall;
    }

    return (
      <button
        className="button button-large flush"
        onClick={this.handleChangeCurrentState.bind(this, newState)}>
        Back
      </button>
    );
  }

  getFooter() {
    return (
      <div>
        {this.getAdvancedFooter()}
        {this.getReviewFooter()}
        {this.getInstallFooter()}
      </div>
    );
  }

  getInstallButton() {
    let {
      currentState,
      descriptionError,
      installError,
      pendingRequest
    } = this.internalStorage_get();

    let {reviewAdvancedConfig, defaultInstall, packageInstalled} = INSTALL_STATES;
    if (currentState !== defaultInstall &&
      currentState !== reviewAdvancedConfig &&
      currentState !== packageInstalled ||
      installError) {
      return null;
    }

    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let buttonAction = this.handleInstallPackage;
    let buttonClasses = classNames({
      'button button-success flush-bottom': true,
      'button-wide': currentState === defaultInstall || currentState === packageInstalled,
      'button-large': currentState === reviewAdvancedConfig
    });
    let buttonText = 'Install';

    if (pendingRequest) {
      buttonText = 'Installing...';
    }

    if (currentState === packageInstalled) {
      buttonAction = this.props.onClose;
      buttonText = (
        <i className="icon icon-sprite icon-sprite-mini icon-sprite-mini-white icon-check-mark" />
      );
    }

    return (
      <button
        disabled={!cosmosPackage || pendingRequest || descriptionError}
        className={buttonClasses}
        onClick={buttonAction}>
        {buttonText}
      </button>
    );
  }

  getInstallError() {
    let {installError} = this.internalStorage_get();
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

  getInstallFooter() {
    let {currentState} = this.internalStorage_get();
    if (currentState !== INSTALL_STATES.defaultInstall &&
      currentState !== INSTALL_STATES.packageInstalled) {
      return null;
    }

    return (
      <div className="button-collection horizontal-center flush-bottom">
        {this.getReviewButton()}
        {this.getInstallButton()}
        {this.getAdvancedButton()}
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

  getModalContents() {
    let {isLoading} = this.internalStorage_get();
    let cosmosPackage = CosmosPackagesStore.getPackageDetails();

    if (isLoading || !cosmosPackage) {
      return this.getLoadingScreen();
    }

    return (
      <div>
        {this.getInstallError()}
        {this.getPackageInfo()}
        {this.getPostInstallNotes()}
        {this.getReviewConfig()}
        {this.getAdvancedConfig()}
      </div>
    );
  }

  getPackageInfo() {
    let {
      currentState,
      descriptionError,
      installError
    } = this.internalStorage_get();
    if (currentState !== INSTALL_STATES.defaultInstall || installError) {
      return null;
    }

    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let {name, version} = cosmosPackage.get('package');

    let error;
    if (descriptionError) {
      error = (
        <p className="text-danger text-small text-align-center">
          {descriptionError}
        </p>
      );
    }

    return (
      <div className="horizontal-center">
        <div className="icon icon-jumbo icon-image-container icon-app-container">
          <img src={cosmosPackage.getIcons()['icon-large']} />
        </div>
        <Form definition={this.getAppIdFormDefinition()}
            onSubmit={this.handleChangeAppId} />
        <p className="flush-bottom">{`${name} ${version}`}</p>
        {error}
      </div>
    );
  }

  getPostInstallNotes() {
    let {currentState} = this.internalStorage_get();
    if (currentState !== INSTALL_STATES.packageInstalled) {
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

  getReviewButton() {
    let {currentState, installError, pendingRequest} =
      this.internalStorage_get();
    let {
      advancedInstall,
      defaultInstall,
      packageInstalled,
      reviewAdvancedConfig,
      reviewDefaultConfig
    } = INSTALL_STATES;
    if (installError || currentState === packageInstalled) {
      return null;
    }

    let buttonText = 'View Configuration Details';
    let newState = reviewDefaultConfig;
    if (currentState === advancedInstall) {
      buttonText = 'Review and Install';
      newState = reviewAdvancedConfig;
    }

    let buttonClasses = classNames({
      'button': true,
      'button-large button-success flush-bottom':
        currentState === advancedInstall,
      'button-small button-stroke button-rounded':
        currentState === defaultInstall
    });

    return (
      <button
        disabled={!CosmosPackagesStore.getPackageDetails() || pendingRequest}
        className={buttonClasses}
        onClick={this.handleChangeCurrentState.bind(this, newState)}>
        {buttonText}
      </button>
    );
  }

  getReviewFooter() {
    let {currentState} = this.internalStorage_get();
    if (currentState !== INSTALL_STATES.reviewDefaultConfig &&
      currentState !== INSTALL_STATES.reviewAdvancedConfig) {
      return null;
    }

    return (
      <div className="button-collection flush-bottom">
        {this.getBackButton()}
        {this.getInstallButton()}
      </div>
    );
  }

  getAppIdAndConfiguration() {
    let {appId, currentState} = this.internalStorage_get();

    let advancedConfig = currentState === INSTALL_STATES.advancedInstall || currentState === INSTALL_STATES.reviewAdvancedConfig;

    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    let {name} = cosmosPackage.get('package');
    let configuration = SchemaUtil.definitionToJSONDocument(
      SchemaUtil.schemaToMultipleDefinition(cosmosPackage.get('config'))
    );
    if (advancedConfig) {
      configuration = this.triggerAdvancedSubmit().model;
    }

    let advancedName =
      Util.findNestedPropertyInObject(configuration, `${name}.framework-name`);
    // Copy appId to framework name when using default install and
    // name option is available
    if (advancedName && !advancedConfig && appId) {
      configuration[name]['framework-name'] = appId;
    }
    // Copy framework name to appId when using advanced install and
    // name option is available
    if (advancedName && advancedConfig) {
      appId = advancedName;
    }

    return {appId, configuration};
  }

  getReviewConfig() {
    let {currentState} = this.internalStorage_get();
    let {reviewAdvancedConfig, reviewDefaultConfig} = INSTALL_STATES;
    if (currentState !== reviewDefaultConfig &&
      currentState !== reviewAdvancedConfig) {
      return null;
    }

    let cosmosPackage = CosmosPackagesStore.getPackageDetails();
    if (!cosmosPackage) {
      return null;
    }

    let {name, version} = cosmosPackage.get('package');
    let {appId, configuration} = this.getAppIdAndConfiguration();

    return (
      <ReviewConfig
        packageIcon={cosmosPackage.getIcons()['icon-small']}
        packageType={name}
        packageName={appId}
        packageVersion={version}
        configuration={configuration} />
    );
  }

  render() {
    let {props} = this;
    let {currentState} = this.internalStorage_get();
    let {
      advancedInstall,
      reviewAdvancedConfig,
      reviewDefaultConfig
    } = INSTALL_STATES;
    let isReviewing = currentState === reviewAdvancedConfig ||
      currentState === reviewDefaultConfig ||
      currentState === advancedInstall;
    let cosmosPackage = CosmosPackagesStore.getPackageDetails();

    let modalClasses = classNames('modal', {
      'modal-large': isReviewing,
      'modal-narrow': !isReviewing
    });

    let modalWrapperClasses = classNames({
      'multiple-form-modal': currentState === reviewAdvancedConfig ||
        currentState === advancedInstall
    });

    let modalBodyClasses = classNames({
      'modal-content': !isReviewing
    });

    let modalInnerBodyClasses = classNames({
      'modal-content-inner container container-pod container-pod-short': !isReviewing,
      'flush-top flush-bottom': isReviewing
    });

    if (!cosmosPackage) {
      return null;
    }

    return (
      <Modal
        bodyClass={modalBodyClasses}
        maxHeightPercentage={1}
        footer={this.getFooter()}
        innerBodyClass={modalInnerBodyClasses}
        modalClass={modalClasses}
        modalWrapperClass={modalWrapperClasses}
        onClose={props.onClose}
        open={props.open}
        showCloseButton={false}
        showFooter={true}>
        {this.getModalContents()}
      </Modal>
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
  onClose: React.PropTypes.func
};

module.exports = InstallPackageModal;
