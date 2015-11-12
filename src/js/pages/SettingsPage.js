import React from "react";
import { RouteHandler } from "react-router";

import Page from "../components/Page";
import TabsMixin from "../mixins/TabsMixin";
import Util from "../utils/Util";

export default class SettingsPage extends Util.mixin(TabsMixin) {

  constructor() {
    super();

    this.tabs = {
      settings: "System",
      access: "Access Control"
    };

    this.state = {
      currentTab: Object.keys(this.tabs).shift()
    };
  }

  componentWillMount() {
    let routes = this.context.router.getCurrentRoutes();
    let currentRoute = routes[routes.length - 1].name;

    if (Object.keys(this.tabs).indexOf(currentRoute) >= 0) {
      this.setState({currentTab: currentRoute});
    }
  }

  getNavigation() {
    return (
      <div>
        {this.tabs_getTabLinks("h1 page-header-title inverse flush")}
      </div>
    );
  }

  render() {
    return (
      <Page
        title={this.getNavigation()}>
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
