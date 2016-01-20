import {Route, Redirect} from 'react-router';

import GroupsTab from '../../pages/settings/GroupsTab';
import OverviewTab from '../../pages/settings/OverviewTab';
import SettingsPage from '../../pages/SettingsPage';
import UsersTab from '../../pages/settings/UsersTab';

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
          type: Redirect,
          from: '/settings/system/?',
          to: 'settings-system-overview'
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

export default settingsRoutes;
