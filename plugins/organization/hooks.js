import {Route, Redirect} from 'react-router';

const PluginHooks = {

  defaults: {
    redirect: {
      type: Redirect,
      from: '/settings/?',
      to: 'settings-organization'
    },
    organizationRoutes: []
  },
  /**
   * @param  {Object} Hooks The Hooks API
   */
  initialize(Hooks) {
    Hooks.addFilter('getSettingsRoutes', this.getRoutes.bind(this, Hooks));
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
