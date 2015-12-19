import qs from "query-string";
import React from "react";

import ACLAuthStore from "../../stores/ACLAuthStore";
import ClusterHeader from "../../components/ClusterHeader";
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
        events: ["roleChange", "success", "error"]
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onAuthStoreRoleChange() {
    let router = this.context.router;
    let loginRedirectRoute = ACLAuthStore.get("loginRedirectRoute");

    if (!ACLAuthStore.isAdmin()) {
      router.transitionTo("/access-denied");
    } else if (loginRedirectRoute) {
      // Go to redirect route if it is present
      router.transitionTo(loginRedirectRoute);
    } else {
      // Go to home
      router.transitionTo("/");
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
        fieldType: "text",
        name: "uid",
        placeholder: "Username",
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
    let buttonText = "Sign In";
    if (this.state.disableLogin) {
      buttonText = "Signing in...";
    }

    return [
      {
        text: buttonText,
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
        modalProps={{modalClass: "modal modal-narrow"}}>
        <ClusterHeader useClipboard={false} />
      </FormModal>
    );
  }
}

LoginModal.contextTypes = {
  router: React.PropTypes.func
};
