import _ from 'underscore';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import DirectoriesTab from './pages/DirectoriesTab';

let PluginHooks = {
  configuration: {
    enabled: false
  },

  getOrganizationRoutes(route) {
    route.routes.push({
      type: Route,
      name: 'settings-organization-directories',
      path: 'directories/?',
      handler: DirectoriesTab,
      children: [{
        type: Route,
        name: 'settings-organization-directories-panel'
      }]
    });
    return route;
  },

  /**
   * @param  {Object} Hooks The Hooks API
   */
  initialize(Hooks) {
    Hooks.addFilter('getOrganizationRoutes',
      this.getOrganizationRoutes.bind(this));

    Hooks.addFilter('settings-organization-tabs',
      this.getTabs.bind(this));
  },

  getTabs(tabs) {
    return _.extend(tabs, {
      'settings-organization-directories': {
        content: 'External Directory',
        priority: 5
      }
    });
  }
};

module.exports = PluginHooks;

