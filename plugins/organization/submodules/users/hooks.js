import _ from 'underscore';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route, Redirect} from 'react-router';

import _UsersTab from './pages/UsersTab';

module.exports = (PluginSDK) => {

  let UsersTab = _UsersTab(PluginSDK);
  let {Hooks} = PluginSDK;

  let UsersPluginHooks = {
    configuration: {
      enabled: false
    },

    defaults: {
      redirect: {
        type: Redirect,
        from: '/settings/organization/?',
        to: 'settings-organization-users'
      },
      route: {
        type: Route,
        name: 'settings-organization-users',
        path: 'users/?',
        handler: UsersTab,
        children: [{
          type: Route,
          name: 'settings-organization-users-user-panel',
          path: ':userID'
        }]
      },
      tabs: {
        'settings-organization-users': {
          content: 'Users',
          priority: 50
        }
      }
    },

    getOrganizationRoutes(route) {
      route.redirect = this.defaults.redirect;
      route.routes.push(this.defaults.route);
      return route;
    },

    initialize() {
      Hooks.addFilter('getOrganizationRoutes', this.getOrganizationRoutes.bind(this));

      Hooks.addFilter('getTabsFor_settings-organization',
        this.getTabs.bind(this));
    },

    getTabs(tabs) {
      return _.extend(tabs, this.defaults.tabs);
    }
  };

  return UsersPluginHooks;
};
