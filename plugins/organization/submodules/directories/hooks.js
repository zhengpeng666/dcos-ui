import _ from 'underscore';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import _DirectoriesTab from './pages/DirectoriesTab';

module.exports = (PluginSDK) => {

  let DirectoriesTab = _DirectoriesTab(PluginSDK);
  let {Hooks} = PluginSDK;

  return {
    configuration: {
      enabled: false
    },

    appendRoutes(route) {
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

    initialize() {
      Hooks.addFilter('OrganizationRoutes', this.appendRoutes.bind(this));
      Hooks.addFilter('settings-organization-tabs', this.getTabs.bind(this));
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
};
