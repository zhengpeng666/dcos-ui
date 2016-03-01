/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import OverviewTab from './pages/OverviewTab';

let PluginHooks = {

  getRoutes(route) {
    route.routes.push({
      type: Route,
      name: 'settings-system-overview',
      path: 'overview/?',
      handler: OverviewTab
    });
    return route;
  },

  /**
   * @param  {Object} Hooks The Hooks API
   */
  initialize(Hooks) {
    Hooks.addFilter('SystemRoutes', this.getRoutes.bind(this));
  }
};

module.exports = PluginHooks;

