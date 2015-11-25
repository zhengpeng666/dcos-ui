import classNames from "classnames";
import {Link, RouteHandler} from "react-router";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import Page from "../components/Page";
import TabsUtil from "../utils/TabsUtil";
import TabsMixin from "../mixins/TabsMixin";
import Util from "../utils/Util";

const SETTINGS_TABS = {
  "settings-organization": "Organization"
  // TODO: add "settings-system": "System"
};

export default class SettingsPage extends Util.mixin(TabsMixin) {
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
    let currentRoute = routes[routes.length - 1].name;

    let pageKeys = Object.keys(SETTINGS_TABS);

    if (currentRoute.indexOf(pageKeys[0]) >= 0) {
      this.tabs_tabs = {
        "settings-organization-users": "Users",
        "settings-organization-groups": "Groups"
      };
    }

    if (currentRoute.indexOf(pageKeys[1]) >= 0) {
      this.tabs_tabs = {
        "settings-system-overview": "Overview"
      };
    }

    if (Object.keys(this.tabs_tabs).indexOf(currentRoute) >= 0) {
      this.setState({currentTab: currentRoute});
    }
  }

  getRoutedItem(tab, isActive) {
    let tabClass = classNames({
      "active": isActive
    });

    return (
      <li className={tabClass} key={tab}>
        <Link
          to={tab}
          className="h1 page-header-title inverse flush">
          {SETTINGS_TABS[tab]}
        </Link>
      </li>
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
          this.getRoutedItem.bind(this)
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
        <RouteHandler />
      </Page>
    );
  }
}

SettingsPage.contextTypes = {
  router: React.PropTypes.func
};

SettingsPage.routeConfig = {
  label: "Settings",
  icon: "resources-settings",
  matches: /^\/settings/
};
