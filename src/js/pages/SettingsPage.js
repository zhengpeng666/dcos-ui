import React from "react";
import {RouteHandler} from "react-router";

import Page from "../components/Page";

export default class SettingsPage extends React.Component {

  getNavigation() {
    return (
      <h1 className="page-header-title inverse flush">
        <span className="button button-link button-primary">
          System
        </span>
        <span className="button button-link">
          Access Control
        </span>
      </h1>
    );
  }

  render() {
    return (
      <Page
        renderNavigation={this.getNavigation}>
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
