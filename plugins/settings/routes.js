import {Route, Redirect} from 'react-router';

import ComponentsHealthTab from '../health/pages/ComponentsHealthTab';
import DirectoriesTab from '../directories/pages/DirectoriesTab';
import GroupsTab from '../groups/pages/GroupsTab';
import OverviewTab from '../overview/pages//OverviewTab';
import SettingsPage from './pages/SettingsPage';
import UsersTab from '../users/pages/UsersTab';

let settingsRoutes = {
  type: Route,
  name: 'settings',
  path: 'settings/?',
  handler: SettingsPage,
  children: [
    {
      type: Route,
      name: 'settings-system',
      path: 'system/?',
      children: [
        {
          type: Route,
          name: 'settings-system-overview',
          path: 'overview/?',
          handler: OverviewTab
        },
        {
          type: Route,
          name: 'settings-system-components',
          path: 'components/?',
          handler: ComponentsHealthTab
        },
        {
          type: Redirect,
          from: '/settings/system/?',
          to: 'settings-system-components'
        }
      ]
    },
    {
      type: Route,
      name: 'settings-organization',
      path: 'organization/?',
      children: [
        {
          type: Route,
          name: 'settings-organization-users',
          path: 'users/?',
          handler: UsersTab,
          children: [{
            type: Route,
            name: 'settings-organization-users-user-panel',
            path: ':userID'
          }]
        },
        {
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
        {
          type: Route,
          name: 'settings-organization-directories',
          path: 'directories/?',
          handler: DirectoriesTab,
          children: [{
            type: Route,
            name: 'settings-organization-directories-panel'
          }]
        },
        {
          type: Redirect,
          from: '/settings/organization/?',
          to: 'settings-organization-users'
        }
      ]
    },
    {
      type: Redirect,
      from: '/settings/?',
      to: 'settings-organization'
    }
  ]
};

module.exports = settingsRoutes;
