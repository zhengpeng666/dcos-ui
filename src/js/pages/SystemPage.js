import _ from 'underscore';
import {Link, RouteHandler} from 'react-router';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Hooks} from 'PluginSDK';
import Page from '../components/Page';
import SidebarActions from '../events/SidebarActions';
import TabsUtil from '../utils/TabsUtil';
import TabsMixin from '../mixins/TabsMixin';

// Default Tabs
let DEFAULT_SERVICES_TABS = {
  'system-overview': {
    content: 'Overview',
    priority: 30
  }
};

let DEFAULT_TABS_TABS = {
  'system-overview-units': {
    content: 'Components',
    priority: 20
  },
  'system-overview-repositories': {
    content: 'Repositories',
    priority: 10
  }
};

let SYSTEM_TABS;

class SystemPage extends mixin(TabsMixin) {
  constructor() {
    super();

    // Get top level tabs
    SYSTEM_TABS = TabsUtil.sortTabs(
      Hooks.applyFilter('SystemTabs', DEFAULT_SERVICES_TABS)
    );
    // Add filter to register default Component Tab
    Hooks.addFilter('system-overview-tabs', function (tabs) {
      return _.extend(tabs, DEFAULT_TABS_TABS);
    });

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
      Hooks.applyFilter(`${topLevelTab}-tabs`, {})
    );

    this.setState({currentTab});
  }

  getRoutedItem(tab) {
    return (
      <Link
        to={tab}
        className="tab-item-label h1 page-header-title inverse flush">
        {SYSTEM_TABS[tab]}
      </Link>
    );
  }

  getTitle() {
    let routes = this.context.router.getCurrentRoutes();
    let currentRoute = routes[routes.length - 2].name;

    return (
      <ul className="tabs list-inline list-unstyled">
        {TabsUtil.getTabs(
          SYSTEM_TABS,
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

SystemPage.contextTypes = {
  router: React.PropTypes.func
};

SystemPage.routeConfig = {
  label: 'System',
  icon: 'system',
  matches: /^\/system/
};

SystemPage.willTransitionTo = function () {
  SidebarActions.close();
};

module.exports = SystemPage;
