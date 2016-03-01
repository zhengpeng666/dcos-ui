import {Route, Redirect} from 'react-router';

import UnitsHealthTab from '../../pages/UnitsHealthTab';
import {Hooks} from '../../pluginBridge/PluginBridge';
import SettingsPage from '../../pages/SettingsPage';

let RouteFactory = {

  getSystemRoutes() {
    // Return filtered Routes
    return this.getFilteredRoutes(
      Hooks.applyFilter('SystemRoutes', {
        routes: {
          type: Route,
          name: 'settings-system-units',
          path: 'units/?',
          handler: UnitsHealthTab,
          children: [
            {
              type: Route,
              name: 'settings-system-units-unit-nodes-panel',
              path: ':unitID/?',
              children: [
                {
                  type: Route,
                  name: 'settings-system-units-unit-nodes-node-panel',
                  path: 'nodes/:unitNodeID'
                }
              ]
            },
            {
              type: Redirect,
              from: ':unitID/?',
              to: 'settings-system-units-unit-nodes-panel'
            }
          ]
        },
        redirect: {
          type: Redirect,
          from: '/settings/system/?',
          to: 'settings-system-units'
        }
      })
    );
  },

  getSettingsRoutes() {
    let systemRoute = {
      type: Route,
      name: 'settings-system',
      path: 'system/?'
    };
    // Get children from settings Route
    systemRoute.children = RouteFactory.getSystemRoutes();

    // Return filtered Routes
    return this.getFilteredRoutes(
      // Pass in Object so Plugins can mutate routes and the default redirect
      Hooks.applyFilter('SettingsRoutes', {
        routes: [systemRoute],
        redirect: {
          type: Redirect,
          from: '/settings/?',
          to: 'settings-system'
        }
      })
    );
  },

  getFilteredRoutes(filteredRoutes) {
    // Push redirect onto Routes Array
    return filteredRoutes.routes.concat([filteredRoutes.redirect]);
  },

  getRoutes() {

    let childRoutes = this.getSettingsRoutes();

    return {
      type: Route,
      name: 'settings',
      path: 'settings/?',
      handler: SettingsPage,
      children: childRoutes
    };
  }
};

module.exports = RouteFactory;
