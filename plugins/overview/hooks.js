/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import OverviewTab from './pages/OverviewTab';

let PluginHooks = {
  routes: {
    route: {
      type: Route,
      name: 'settings-system-overview',
      path: 'overview/?',
      handler: OverviewTab
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
    Hooks.addFilter('SystemRoutes', this.getOrganizationRoutes.bind(this));
  }
};

module.exports = PluginHooks;

