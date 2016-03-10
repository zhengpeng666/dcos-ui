/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import OverviewTab from './pages/OverviewTab';

let SDK = require('./SDK').getSDK();

module.exports = {
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
    SDK.Hooks.addFilter('SystemRoutes', this.appendRoutes.bind(this));
  }
};
