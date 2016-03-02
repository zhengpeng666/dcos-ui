import _ from 'underscore';
import {Route, Redirect} from 'react-router';

const PluginHooks = {
  /**
   * @param  {Object} Hooks The Hooks API
   */
  initialize(Hooks) {
    Hooks.addFilter('SettingsRoutes', this.appendRoutes.bind(this, Hooks));
    Hooks.addFilter('SettingsTabs', this.getTabs.bind(this));
  },

  getTabs(tabs) {
    return _.extend(tabs, {
      'settings-organization': {
        content: 'Organization',
        priority: 20
      }
    });
  },

  getOrganizationRoutes(Hooks) {
    // Return filtered Routes
    return this.getFilteredRoutes(
      // Pass in Object so Plugins can mutate routes and the default redirect
      Hooks.applyFilter('OrganizationRoutes', {
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

  appendRoutes(Hooks, route) {
    let childRoutes = this.getOrganizationRoutes(Hooks);

    route.redirect = {
      type: Redirect,
      from: '/settings/?',
      to: 'settings-organization'
    };
    route.routes.push(
      {
        type: Route,
        name: 'settings-organization',
        path: 'organization/?',
        children: childRoutes
      }
    );
    return route;
  }
};

module.exports = PluginHooks;
