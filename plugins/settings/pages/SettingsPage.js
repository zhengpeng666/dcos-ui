import {Link, RouteHandler} from 'react-router';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

import Page from '../../../src/js/components/Page';
import TabsUtil from '../../../src/js/utils/TabsUtil';
import TabsMixin from '../../../src/js/mixins/TabsMixin';

const SETTINGS_TABS = {
  'settings-organization': 'Organization',
  'settings-system': 'System'
};

class SettingsPage extends mixin(TabsMixin) {
  constructor() {
    super();

    this.tabs_tabs = {};
    this.state = {};
  }

  componentWillMount() {
    this.updateCurrentTab();
  }

  componentWillReceiveProps() {
    this.updateCurrentTab();
  }

  updateCurrentTab() {
    let routes = this.context.router.getCurrentRoutes();
    let currentTab = routes[routes.length - 1].name;

    let pageKeys = Object.keys(SETTINGS_TABS);

    // Organization Tabs
    if (currentTab.indexOf(pageKeys[0]) >= 0) {
      this.tabs_tabs = {
        'settings-organization-users': 'Users',
        'settings-organization-groups': 'Groups',
        'settings-organization-directories': 'External Directory'
      };
    }

    // System Tabs
    if (currentTab.indexOf(pageKeys[1]) >= 0) {
      this.tabs_tabs = {
        // todo: content for Overview Tab
        // 'settings-system-overview': 'Overview',
        'settings-system-components': 'Components'
      };
    }

    this.setState({currentTab});
  }

  getRoutedItem(tab) {
    return (
      <Link
        to={tab}
        className="tab-item-label h1 page-header-title inverse flush">
        {SETTINGS_TABS[tab]}
      </Link>
    );
  }

  getTitle() {
    let routes = this.context.router.getCurrentRoutes();
    let currentRoute = routes[routes.length - 2].name;

    return (
      <ul className="tabs list-inline list-unstyled">
        {TabsUtil.getTabs(
          SETTINGS_TABS,
          currentRoute,
          this.getRoutedItem
        )}
      </ul>
    );
  }

  getNavigation() {
    return (
      <ul className="tabs list-inline flush-bottom inverse">
        {this.tabs_getRoutedTabs()}
      </ul>
    );
  }

  render() {
    return (
      <Page
        title={this.getTitle()}
        navigation={this.getNavigation()}>
        <RouteHandler currentTab={this.state.currentTab} />
      </Page>
    );
  }
}

SettingsPage.contextTypes = {
  router: React.PropTypes.func
};

SettingsPage.routeConfig = {
  label: 'Settings',
  icon: 'resources-settings',
  matches: /^\/settings/
};

module.exports = SettingsPage;
