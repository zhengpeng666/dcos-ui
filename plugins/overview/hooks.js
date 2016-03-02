/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import _OverviewTab from './pages/OverviewTab';

module.exports = (PluginSDK) => {

  let {Hooks} = PluginSDK;

  let OverviewTab = _OverviewTab(PluginSDK);

  return {
    appendRoutes(route) {
      route.routes.push({
        type: Route,
        name: 'settings-system-overview',
        path: 'overview/?',
        handler: OverviewTab
      });
      return route;
    },

    initialize() {
      Hooks.addFilter('SystemRoutes', this.appendRoutes.bind(this));
    }
  };
};
