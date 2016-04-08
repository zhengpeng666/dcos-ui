import React from 'react';
import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';

let SDK = require('../SDK').getSDK();

let AuthStore = SDK.get('AuthStore');

let METHODS_TO_BIND = [
  'onMessageReceived'
];

class LoginPage extends mixin(StoreMixin) {
  componentWillMount() {
    super.componentWillMount();

    if (AuthStore.getUser()) {
      this.context.router.transitionTo('/');
    }

    this.store_listeners = [
      {
        name: 'auth',
        events: ['success', 'error'],
        suppressUpdate: true
      }
    ];

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });

    window.addEventListener('message', this.onMessageReceived);
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    window.removeEventListener('message', this.onMessageReceived);
  }

  onMessageReceived(event) {
    if (event.origin !== SDK.config.authHost) {
      return;
    }

    let data = JSON.parse(event.data);

    switch (data.type) {
      case 'token':
        AuthStore.login({token: data.token});
        break;
      case 'error':
        this.navigateToAccessDenied();
        break;
    }
  }

  onAuthStoreSuccess() {
    let router = this.context.router;
    let loginRedirectRoute = AuthStore.get('loginRedirectRoute');

    if (loginRedirectRoute) {
      router.transitionTo(loginRedirectRoute);
    } else {
      router.transitionTo('/');
    }
  }

  onAuthStoreError() {
    this.navigateToAccessDenied();
  }

  navigateToAccessDenied() {
    let router = this.context.router;

    router.transitionTo('/access-denied');
  }

  render() {
    let firstUser = SDK.Store.getAppState()
      .config.config.clusterConfiguration.firstUser;

    let location = `/login?firstUser=${firstUser}`;

    return (
      <div className="iframe-page-container">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          id="oauth-iframe"
          src={location} />
      </div>
    );
  }
}

LoginPage.contextTypes = {
  router: React.PropTypes.func
};

module.exports = LoginPage;

