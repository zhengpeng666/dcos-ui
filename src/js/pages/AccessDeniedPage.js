import React from "react";

import AlertPanel from "../components/AlertPanel";

export default class AccessDeniedPage extends React.Component {

  render() {
    return (
      <AlertPanel
        title="Access Denied">
        <i className="icon icon-sprite icon-sprite-jumbo
          icon-sprite-jumbo-color icon-lost-planet"></i>
        <p>
          You do not have access to this service.
          Please contact your DCOS administrator.
        </p>
      </AlertPanel>
    );
  }
}
