/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/
import { RouteHandler } from "react-router";

export default class SettingsPage extends React.Component {

  render() {
    let pages = {
      "settings-organization": "Organization"
    };

    return (
      <RouteHandler pages={pages} />
    );
  }
}

SettingsPage.routeConfig = {
  label: "Settings",
  icon: "resources-settings",
  matches: /^\/settings/
};
