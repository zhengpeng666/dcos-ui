/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/
import { RouteHandler } from "react-router";

export default class SettingsPage extends React.Component {

  render() {
    let tabs = {
      "settings-system": "System",
      "settings-organization": "Organization"
    };

    return (
      <RouteHandler tabs={tabs} />
    );
  }
}

SettingsPage.routeConfig = {
  label: "Settings",
  icon: "resources-settings",
  matches: /^\/settings/
};
