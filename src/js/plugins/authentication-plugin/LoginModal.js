/* eslint-disable no-unused-vars */
import React from "react";
import Router from "react-router";
/* eslint-enable no-unused-vars */

import ACLAuthStore from "../../stores/ACLAuthStore";
import FormModal from "../../components/FormModal";
import StoreMixin from "../../mixins/StoreMixin";
import Util from "../../utils/Util";

const METHODS_TO_BIND = [
  "handleLoginSubmit"
];

export default class LoginModal extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      disableLogin: false,
      errorMsg: false
    };

    this.store_listeners = [
      {
        name: "auth",
        events: ["success", "error"]
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onAuthStoreSuccess() {
    this.setState({disableLogin: false});
    debugger;
    let router = this.context.router;
    let loginRedirectRoute = ACLAuthStore.get("loginRedirectRoute");
    if (loginRedirectRoute) {
      // Go to redirect route if it is present
      router.transitionTo(loginRedirectRoute);
    } else {
      // Go to home
      router.transitionTo("/");
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
        fieldType: "text",
        name: "description",
        placeholder: "Full name",
        required: true,
        showError: false,
        showLabel: false,
        writeType: "input",
        validation: function () { return true; },
        value: ""
      },
      {
        fieldType: "password",
        name: "password",
        placeholder: "Password",
        required: true,
        showError: this.state.errorMsg,
        showLabel: false,
        writeType: "input",
        validation: function () { return true; },
        value: ""
      }
    ];
  }

  getLoginButtonDefinition() {
    return [
      {
        text: "Sign in",
        className: "button button-primary button-wide",
        isSubmit: true
      }
    ];
  }

  render() {
    return (
      <FormModal
        buttonDefinition={this.getLoginButtonDefinition()}
        definition={this.getLoginFormDefinition()}
        disabled={this.state.disableLogin}
        onSubmit={this.handleLoginSubmit}
        open={true}
        titleText="Login"
        modalProps={{modalClass: "modal modal-narrow"}} />
    );
  }
}

LoginModal.contextTypes = {
  router: React.PropTypes.func
};
