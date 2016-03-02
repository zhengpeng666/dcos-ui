import _ from 'underscore';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route, Redirect} from 'react-router';

import _UsersTab from './pages/UsersTab';

module.exports = (PluginSDK) => {

  let UsersTab = _UsersTab(PluginSDK);
  let {Hooks} = PluginSDK;

  return {
    configuration: {
      enabled: false
    },

    appendRoutes(route) {
      route.redirect = {
        type: Redirect,
        from: '/settings/organization/?',
        to: 'settings-organization-users'
      };
      route.routes.push({
        type: Route,
        name: 'settings-organization-users',
        path: 'users/?',
        handler: UsersTab,
        children: [{
          type: Route,
          name: 'settings-organization-users-user-panel',
          path: ':userID'
        }]
      });
      return route;
    },

    initialize() {
      Hooks.addFilter('OrganizationRoutes', this.appendRoutes.bind(this));
      Hooks.addFilter('settings-organization-tabs', this.getTabs.bind(this));
    },

    getTabs(tabs) {
      return _.extend(tabs, {
        'settings-organization-users': {
          content: 'Users',
          priority: 50
        }
      });
    }
  };
};
