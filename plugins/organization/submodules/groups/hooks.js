import _ from 'underscore';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import _GroupsTab from './pages/GroupsTab';

module.exports = (PluginSDK) => {

  let GroupsTab = _GroupsTab(PluginSDK);
  let {Hooks} = PluginSDK;

  return {
    configuration: {
      enabled: false
    },

    appendRoutes(route) {
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

    initialize() {
      Hooks.addFilter('OrganizationRoutes', this.appendRoutes.bind(this));
      Hooks.addFilter('settings-organization-tabs', this.getTabs.bind(this));
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
};
