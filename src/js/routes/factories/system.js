import {Route, Redirect} from 'react-router';

import {Hooks} from 'PluginSDK';
import RepositoriesTab from '../../pages/system/RepositoriesTab';
import SystemPage from '../../pages/SystemPage';
import UnitsHealthTab from '../../pages/system/UnitsHealthTab';

let RouteFactory = {

  getOverviewRoutes() {
    // Return filtered Routes
    return this.getFilteredRoutes(
      Hooks.applyFilter('OverviewRoutes', {
        routes: [
          {
            type: Route,
            name: 'system-overview-units',
            path: 'components/?',
            handler: UnitsHealthTab,
            children: [
              {
                type: Route,
                name: 'system-overview-units-unit-nodes-panel',
                path: ':unitID/?',
                children: [
                  {
                    type: Route,
                    name: 'system-overview-units-unit-nodes-node-panel',
                    path: 'nodes/:unitNodeID'
                  }
                ]
              },
              {
                type: Redirect,
                from: ':unitID/?',
                to: 'system-overview-units-unit-nodes-panel'
              }
            ]
          },
          {
            type: Route,
            name: 'system-overview-repositories',
            path: 'repositories/?',
            handler: RepositoriesTab
          }
        ],
        redirect: {
          type: Redirect,
          from: '/system/overview/?',
          to: 'system-overview-units'
        }
      })
    );
  },

  getSystemRoutes() {
    let overviewRoute = {
      type: Route,
      name: 'system-overview',
      path: 'overview/?'
    };
    // Get children for Overview
    overviewRoute.children = RouteFactory.getOverviewRoutes();

    // Return filtered Routes
    return this.getFilteredRoutes(
      // Pass in Object so Plugins can mutate routes and the default redirect
      Hooks.applyFilter('SystemRoutes', {
        routes: [overviewRoute],
        redirect: {
          type: Redirect,
          from: '/system/?',
          to: 'system-overview'
        }
      })
    );
  },

  getFilteredRoutes(filteredRoutes) {
    // Push redirect onto Routes Array
    return filteredRoutes.routes.concat([filteredRoutes.redirect]);
  },

  getRoutes() {

    let childRoutes = this.getSystemRoutes();

    return {
      type: Route,
      name: 'system',
      path: 'system/?',
      handler: SystemPage,
      children: childRoutes
    };
  }
};

module.exports = RouteFactory;
