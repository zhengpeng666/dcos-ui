/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLAuthStore from "../../stores/ACLAuthStore";
import StoreMixin from "../../mixins/StoreMixin";
import Util from "../../utils/Util";

const METHODS_TO_BIND = ["handleLogin"];

export default class Login extends Util.mixin(StoreMixin) {
  constructor() {
    super(...arguments);
    this.displayName = "Login";

    this.store_listeners = [{
      name: "auth",
      events: ["success", "error"]
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onAuthStoreSuccess() {
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

  onAuthStoreError() {
    // TODO: Handle error
  }

  handleLogin() {
    // TODO: Needs credentials
    ACLAuthStore.login();
  }

  render() {
    return <a onClick={this.handleLogin}>Login</a>;
  }
}

Login.contextTypes = {
  router: React.PropTypes.func
};
