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

  defaults: {
    route: {
      type: Route,
      name: 'settings-organization-directories',
      path: 'directories/?',
      handler: DirectoriesTab,
      children: [{
        type: Route,
        name: 'settings-organization-directories-panel'
      }]
    },
    tabs: {
      'settings-organization-directories': {
        content: 'External Directory',
        priority: 5
      }
    }
  },

  getOrganizationRoutes(route) {
    route.routes.push(this.defaults.route);
    return route;
  },

  /**
   * @param  {Object} Hooks The Hooks API
   */
  initialize(Hooks) {
    Hooks.addFilter('getOrganizationRoutes',
      this.getOrganizationRoutes.bind(this));

    Hooks.addFilter('getTabsFor_settings-organization',
      this.getTabs.bind(this));
  },

  getTabs(tabs) {
    return _.extend(tabs, this.defaults.tabs);
  }
};

module.exports = PluginHooks;

