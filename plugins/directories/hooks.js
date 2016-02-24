/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import DirectoriesTab from './pages/DirectoriesTab';

let PluginHooks = {
  configuration: {
    enabled: false
  },

  routes: {
    route: {
      type: Route,
      name: 'settings-organization-directories',
      path: 'directories/?',
      handler: DirectoriesTab,
      children: [{
        type: Route,
        name: 'settings-organization-directories-panel'
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

