/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/
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

SettingsPage.routeConfig = {
  label: "Settings",
  icon: "resources-settings",
  matches: /^\/settings/
};
