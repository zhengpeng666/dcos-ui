import _ from 'underscore';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import _GroupsTab from './pages/GroupsTab';

module.exports = (PluginSDK) => {

  let GroupsTab = _GroupsTab(PluginSDK);
  let {Hooks} = PluginSDK;

  let GroupsPluginHooks = {
    configuration: {
      enabled: false
    },

    defaults: {
      route: {
        type: Route,
        name: 'settings-organization-groups',
        path: 'groups/?',
        handler: GroupsTab,
        children: [{
          type: Route,
          name: 'settings-organization-groups-group-panel',
          path: ':groupID'
        }]
      },
      tabs: {
        'settings-organization-groups': {
          content: 'Groups',
          priority: 20
        }
      }
    },

    getOrganizationRoutes(route) {
      route.routes.push(this.defaults.route);
      return route;
    },

    initialize() {
      Hooks.addFilter('getOrganizationRoutes', this.getOrganizationRoutes.bind(this));

      Hooks.addFilter('getTabsFor_settings-organization',
        this.getTabs.bind(this));
    },

    getTabs(tabs) {
      return _.extend(tabs, this.defaults.tabs);
    }
  };

  return GroupsPluginHooks;
};
