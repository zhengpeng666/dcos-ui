import classNames from "classnames";
import { Link, RouteHandler } from "react-router";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import Page from "../components/Page";
import TabsUtil from "../utils/TabsUtil";
import TabsMixin from "../mixins/TabsMixin";
import Util from "../utils/Util";

let SETTINGS_PAGES = {
  "settings-organization": "Organization",
  "settings-system": "System"
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

    let pageKeys = Object.keys(SETTINGS_PAGES);

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

  getClassSet(isActive) {
    return classNames({
      "active": isActive
    });
  }

  getLink(tab, isActive) {
    return (
      <li className={this.getClassSet(isActive)} key={tab}>
        <Link
          to={tab}
          className="h1 page-header-title inverse flush">
          {SETTINGS_PAGES[tab]}
        </Link>
      </li>
    );
  }

  getTitle() {
    let routes = this.context.router.getCurrentRoutes();
    let currentRoute = routes[routes.length - 2].name;

    return (
      <ul className="tabs list-inline list-unstyled">
        {TabsUtil.getTabLinks(
          SETTINGS_PAGES,
          currentRoute,
          this.getLink.bind(this)
        )}
      </ul>
    );
  }

  getNavigation() {
    return (
      <ul className="tabs list-inline flush-bottom inverse">
        {this.tabs_getTabLinks()}
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
