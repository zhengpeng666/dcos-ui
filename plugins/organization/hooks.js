import _ from 'underscore';
import {Route, Redirect} from 'react-router';

const PluginHooks = {

  defaults: {

    redirect: {
      type: Redirect,
      from: '/settings/?',
      to: 'settings-organization'
    },
    organizationRoutes: [],

    settingsTabs: {
      'settings-organization': {
        content: 'Organization',
        priority: 20
      }
    }
  },
  /**
   * @param  {Object} Hooks The Hooks API
   */
  initialize(Hooks) {
    Hooks.addFilter('getSettingsRoutes', this.getRoutes.bind(this, Hooks));
    Hooks.addFilter('getSettingsTabs', this.getTabs.bind(this));
  },

  getTabs(tabs) {
    return _.extend(tabs, this.defaults.settingsTabs);
  },

  getOrganizationRoutes(Hooks) {
    // Return filtered Routes
    return this.getFilteredRoutes(
      // Pass in Object so Plugins can mutate routes and the default redirect
      Hooks.applyFilter('getOrganizationRoutes', {
        routes: [].slice.call(this.defaults.organizationRoutes),
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

  getRoutes(Hooks, route) {
    let childRoutes = this.getOrganizationRoutes(Hooks);

    route.redirect = this.defaults.redirect;
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
