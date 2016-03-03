import qs from 'query-string';
import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLAuthStore from '../stores/ACLAuthStore';

let SDK = require('../SDK').getSDK();

function findRedirect(queryString) {
  let redirectTo = false;

  Object.keys(queryString).forEach(function (key) {
    if (/redirect/.test(key)) {
      redirectTo = queryString[key];
    }
  });

  return redirectTo;
}

const METHODS_TO_BIND = [
  'handleLoginSubmit'
];

class LoginModal extends mixin(StoreMixin) {
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
    let redirectTo = false;

    // This will match url instances like this:
    // /?redirect=SOME_ADDRESS#/login
    if (global.location.search) {
      redirectTo = findRedirect(qs.parse(global.location.search));
    }

    // This will match url instances like this:
    // /#/login?redirect=SOME_ADDRESS
    if (!redirectTo && global.location.hash) {
      redirectTo = findRedirect(qs.parse(global.location.hash));
    }

    if (redirectTo) {
      window.location.href = redirectTo;
    } else {
      let user = ACLAuthStore.getUser();
      ACLAuthStore.fetchRole(user.uid);
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
    let MesosphereLogo = SDK.get('MesosphereLogo');

    return (
      <div className="mesosphere-footer-logo">
        <MesosphereLogo height="20" width="148" />
      </div>
    );
  }

  render() {
    let {FormModal, DCOSLogo} = SDK.get(['FormModal', 'DCOSLogo']);

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
          <div className="sidebar-header-image flush-bottom">
            <DCOSLogo />
          </div>
          <div className="container container-pod
            container-pod-short flush-bottom">
            <h3 className="sidebar-header-label flush-top text-align-center
              text-overflow flush-bottom">
              Sign in to Mesosphere DCOS
            </h3>
          </div>
        </div>
      </FormModal>
    );
  }
}

LoginModal.contextTypes = {
  router: React.PropTypes.func
};

module.exports = LoginModal;
