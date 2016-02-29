import _ from 'underscore';
import {Route, Redirect} from 'react-router';

module.exports = (PluginSDK) => {

  let {Hooks} = PluginSDK;

  const OrganizationPluginHooks = {

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

    initialize() {
      Hooks.addFilter('getSettingsRoutes', this.getRoutes.bind(this));
      Hooks.addFilter('getSettingsTabs', this.getTabs.bind(this));
    },

    getTabs(tabs) {
      return _.extend(tabs, this.defaults.settingsTabs);
    },

    getOrganizationRoutes() {
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

    getRoutes(route) {
      let childRoutes = this.getOrganizationRoutes();

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

  return OrganizationPluginHooks;
};
