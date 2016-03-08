import React from 'react';

import ACLAuthStore from '../stores/ACLAuthStore';

let SDK = require('../SDK').getSDK();
/*
 * Exports a higher-order component that checks if user is logged in using the
 * ACLAuthStore. If the user is logged in, the component will render.
 * If the user is not logged in, the user will be redirected to the login page.
 */
module.exports = (ComposedComponent) => {
  return class Authenticated extends React.Component {

    static willTransitionTo(transition) {
      if (!ACLAuthStore.isLoggedIn()) {
        SDK.Hooks.doAction('redirectToLogin', transition);
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  };
};
