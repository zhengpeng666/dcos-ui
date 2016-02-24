/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import GroupsTab from './pages/GroupsTab';

let PluginHooks = {
  configuration: {
    enabled: false
  },

  routes: {
    route: {
      type: Route,
      name: 'settings-organization-groups',
      path: 'groups/?',
      handler: GroupsTab,
      children: [{
        type: Route,
        name: 'settings-organization-groups-group-panel',
        path: ':groupID'
      }]
    }
  },

  getOrganizationRoutes(route) {
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

