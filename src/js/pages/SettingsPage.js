import _ from 'underscore';
import {Link, RouteHandler} from 'react-router';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Hooks} from '../pluginBridge/PluginBridge';
import Page from '../components/Page';
import TabsUtil from '../utils/TabsUtil';
import TabsMixin from '../mixins/TabsMixin';

// Default Tabs
let DEFAULT_SETTINGS_TABS = {
  'settings-system': {
    content: 'System',
    priority: 10
  }
};

let DEFAULT_TABS_TABS = {
  'settings-system-components': {
    content: 'Components',
    priority: 10
  }
};

let SETTINGS_TABS;

class SettingsPage extends mixin(TabsMixin) {
  constructor() {
    super();

    // Get top level tabs
    SETTINGS_TABS = TabsUtil.sortTabs(
      Hooks.applyFilter('getSettingsTabs', DEFAULT_SETTINGS_TABS)
    );
    // Add filter to register default Component Tab
    Hooks.addFilter('getTabsFor_settings-system', (tabs) => _.extend(tabs, DEFAULT_TABS_TABS));

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
    // Get top level Tab
    let topLevelTab = currentTab.split('-').slice(0, 2).join('-');

    this.tabs_tabs = TabsUtil.sortTabs(
      Hooks.applyFilter(`getTabsFor_${topLevelTab}`, {})
    );

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
  icon: 'settings',
  matches: /^\/settings/
};

module.exports = SettingsPage;
