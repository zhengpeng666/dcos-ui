import React from 'react';

import ACLAuthStore from '../stores/ACLAuthStore';
import {ACL_AUTH_LOGIN_REDIRECT} from '../constants/EventTypes';

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

        // Store the route we came from
        SDK.dispatch({
          type: ACL_AUTH_LOGIN_REDIRECT,
          loginRedirectRoute: transition.path
        });

        // Go to login page
        transition.redirect('/login');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  };
};
