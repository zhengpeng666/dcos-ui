import _ from 'underscore';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import GroupsTab from './pages/GroupsTab';

let PluginHooks = {
  configuration: {
    enabled: false
  },

  getOrganizationRoutes(route) {
    route.routes.push({
      type: Route,
      name: 'settings-organization-groups',
      path: 'groups/?',
      handler: GroupsTab,
      children: [{
        type: Route,
        name: 'settings-organization-groups-group-panel',
        path: ':groupID'
      }]
    });
    return route;
  },

  /**
   * @param  {Object} Hooks The Hooks API
   */
  initialize(Hooks) {
    Hooks.addFilter('OrganizationRoutes', this.getOrganizationRoutes.bind(this));

    Hooks.addFilter('settings-organization-tabs',
      this.getTabs.bind(this));
  },

  getTabs(tabs) {
    return _.extend(tabs, {
      'settings-organization-groups': {
        content: 'Groups',
        priority: 20
      }
    });
  }
};

module.exports = PluginHooks;

