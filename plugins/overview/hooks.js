/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import _OverviewTab from './pages/OverviewTab';

module.exports = (PluginSDK) => {

  let {Hooks} = PluginSDK;

  let OverviewTab = _OverviewTab(PluginSDK);

  let OverviewPluginHooks = {
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

    initialize() {
      Hooks.addFilter('getSystemRoutes', this.getOrganizationRoutes.bind(this));
    }
  };

  return OverviewPluginHooks;

};
