import {Route} from 'react-router';

import {Hooks} from 'PluginSDK';
import NetworkPage from '../../pages/NetworkPage';

let RouteFactory = {
  getNetworkingRoutes() {
    let networkingRoute = {
      type: Route,
      name: 'network',
      path: 'network/?',
      handler: NetworkPage
    };

    return Hooks.applyFilter('getNetworkingChildRoutes', networkingRoute);
  },

  getRoutes() {
    return this.getNetworkingRoutes();
  }
};

module.exports = RouteFactory;
