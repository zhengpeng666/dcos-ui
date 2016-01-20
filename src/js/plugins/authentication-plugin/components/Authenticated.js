import React from 'react';

import ACLAuthStore from '../../../stores/ACLAuthStore';

/*
 * Exports a higher-order component that checks if user is logged in using the
 * ACLAuthStore. If the user is logged in, the component will render.
 * If the user is not logged in, the user will be redirected to the login page.
 */
export default (ComposedComponent) => {
  return class Authenticated extends React.Component {

    static willTransitionTo(transition) {
      if (!ACLAuthStore.isLoggedIn()) {

        // Store the route we came from
        ACLAuthStore.set({loginRedirectRoute: transition.path});

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
