/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route, Redirect} from 'react-router';

import UsersTab from './pages/UsersTab';

let PluginHooks = {
  configuration: {
    enabled: false
  },

  routes: {
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
    }
  },

  getOrganizationRoutes(route) {
    route.redirect = this.routes.redirect;
    route.routes.push(this.routes.route);
    return route;
  },

  /**
   * @param  {Object} Hooks The Hooks API
   */
  initialize(Hooks) {
    Hooks.addFilter('getOrganizationRoutes', this.getOrganizationRoutes.bind(this));
  }
};

module.exports = PluginHooks;
