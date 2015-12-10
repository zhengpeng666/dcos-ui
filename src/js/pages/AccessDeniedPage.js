import React from "react";

import AlertPanel from "../components/AlertPanel";

export default class AccessDeniedPage extends React.Component {

  render() {
    return (
      <AlertPanel
        title="Access Denied"
        iconClassName="icon icon-sprite icon-sprite-jumbo
          icon-sprite-jumbo-white icon-lost-planet">
        <p>
          You do not have access to this service. <br />
          Please contact your DCOS administrator.
        </p>
      </AlertPanel>
    );
  }
}
