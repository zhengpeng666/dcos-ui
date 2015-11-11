import React from "react";

import Page from "../components/page";

export default class SettingsPage extends React.Component {
  render() {
    return (
      <Page title="System" />
    );
  }
}

SettingsPage.routeConfig = {
  label: "Settings",
  icon: "resources-settings",
  matches: /^\/settings/
};
