import _ from 'underscore';
import {Route, Redirect} from 'react-router';

let SDK = require('./SDK').getSDK();

module.exports = {

  initialize() {
    SDK.Hooks.addFilter('SettingsRoutes', this.appendRoutes.bind(this));
    SDK.Hooks.addFilter('SettingsTabs', this.getTabs.bind(this));
  },

  getTabs(tabs) {
    return _.extend(tabs, {
      'settings-organization': {
        content: 'Organization',
        priority: 20
      }
    });
  },

  appendOrganizationRoutes() {
    // Return filtered Routes
    return this.getFilteredRoutes(
      // Pass in Object so Plugins can mutate routes and the default redirect
      SDK.Hooks.applyFilter('OrganizationRoutes', {
        routes: [],
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

  appendRoutes(route) {
    let childRoutes = this.appendOrganizationRoutes();

    route.redirect = {
      type: Redirect,
      from: '/settings/?',
      to: 'settings-organization'
    };
    route.routes.push({
      type: Route,
      name: 'settings-organization',
      path: 'organization/?',
      children: childRoutes
    });
    return route;
  }
};
