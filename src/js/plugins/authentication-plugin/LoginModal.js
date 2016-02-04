import qs from 'query-string';
import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLAuthStore from '../../stores/ACLAuthStore';
import ClusterName from '../../components/ClusterName';
import MesosphereLogo from '../../components/icons/MesosphereLogo';
import DCOSLogo from '../../components/DCOSLogo';
import FormModal from '../../components/FormModal';
import MetadataStore from '../../stores/MetadataStore';

const METHODS_TO_BIND = [
  'handleLoginSubmit'
];

export default class LoginModal extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      disableLogin: false,
      errorMsg: false
    };

    this.store_listeners = [
      {
        name: 'auth',
        events: ['roleChange', 'success', 'error']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onAuthStoreRoleChange() {
    let router = this.context.router;
    let loginRedirectRoute = ACLAuthStore.get('loginRedirectRoute');

    if (!ACLAuthStore.isAdmin()) {
      router.transitionTo('/access-denied');
    } else if (loginRedirectRoute) {
      // Go to redirect route if it is present
      router.transitionTo(loginRedirectRoute);
    } else {
      // Go to home
      router.transitionTo('/');
    }

    this.setState({disableLogin: false});
  }

  onAuthStoreSuccess() {
    // See if we need to redirect the user to a service UI
    if (global.location.search) {
      let parsedSearch = qs.parse(global.location.search);
      if (parsedSearch.redirect) {
        window.location.href = parsedSearch.redirect;
        return;
      }
    }
  }

  onAuthStoreError(errorMsg) {
    this.setState({
      disableLogin: false,
      errorMsg
    });
  }

  handleLoginSubmit(model) {
    this.setState({disableLogin: true});
    ACLAuthStore.login(model);
  }

  getLoginFormDefinition() {
    return [
      {
        fieldType: 'text',
        formGroupClass: 'form-group short-bottom',
        name: 'uid',
        placeholder: 'Username',
        required: true,
        showError: false,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      },
      {
        fieldType: 'password',
        name: 'password',
        placeholder: 'Password',
        required: true,
        showError: this.state.errorMsg,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      }
    ];
  }

  getLoginButtonDefinition() {
    let buttonText = 'Sign In';
    if (this.state.disableLogin) {
      buttonText = 'Signing in...';
    }

    return [
      {
        text: buttonText,
        className: 'button button-primary button-wide',
        isSubmit: true
      }
    ];
  }

  getMesosphereLogo() {
    return (
      <div className="mesosphere-footer-logo">
        <MesosphereLogo height="20" width="148" />
      </div>
    );
  }

  render() {
    let data = MetadataStore.get('dcosMetadata');

    let modalProps = {
      innerBodyClass: 'modal-body container container-pod ' +
        'container-pod-short flex-container-col',
      modalClass: 'modal modal-narrow'
    };

    return (
      <FormModal
        buttonDefinition={this.getLoginButtonDefinition()}
        definition={this.getLoginFormDefinition()}
        disabled={this.state.disableLogin}
        extraFooterContent={this.getMesosphereLogo()}
        onSubmit={this.handleLoginSubmit}
        open={true}
        modalProps={modalProps}>
        <div className="container container-fluid container-fluid-narrow
          container-pod container-pod-short flush-top">
          <div className="sidebar-header-image">
            <DCOSLogo />
          </div>
          <div className="container container-pod
            container-pod-super-super-short flush-top">
            <ClusterName />
          </div>
          <div className="text-small text-align-center text-muted">
            Mesosphere DCOS v{data.version}
          </div>
        </div>
      </FormModal>
    );
  }
}

LoginModal.contextTypes = {
  router: React.PropTypes.func
};
