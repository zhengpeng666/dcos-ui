import React from 'react';

import AlertPanel from '../../../components/AlertPanel';

export default class AccessDeniedPage extends React.Component {

  render() {
    return (
      <div className="flex-container-col">
        <div className="page-content container-scrollable inverse">
          <div className="container container-fluid container-pod
            flex-container-col">
            <AlertPanel
              title="Access Denied"
              iconClassName="icon icon-sprite icon-sprite-jumbo
                icon-sprite-jumbo-white icon-lost-planet">
              <p>
                You do not have access to this service. <br />
                Please contact your DCOS administrator.
              </p>
            </AlertPanel>
          </div>
        </div>
      </div>
    );
  }
}
