import React from 'react';

import ACLAuthActions from '../actions/ACLAuthActions';
import AlertPanel from '../../../src/js/components/AlertPanel';

const METHODS_TO_BIND = [
  'handleUserLogout'
];

module.exports = class AccessDeniedPage extends React.Component {
  constructor() {
    super(...arguments);

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleUserLogout() {
    ACLAuthActions.logout();
  }

  render() {
    return (
      <div className="flex-container-col">
        <div className="page-content container-scrollable inverse">
          <div className="container container-fluid container-pod
            flex-container-col">
            <AlertPanel
              title="Access Denied"
              iconClassName="icon icon-sprite icon-sprite-jumbo
                icon-sprite-jumbo-white icon-lost-planet flush-top">
              <div>
                <p>
                  You do not have access to this service. <br />
                  Please contact your DCOS administrator.
                </p>

                <div className="container container-pod container-pod-short-top container-fluid flush-bottom">
                  <button className="button button-primary"
                    onClick={this.handleUserLogout}>
                    Log out
                  </button>
                </div>
              </div>
            </AlertPanel>
          </div>
        </div>
      </div>
    );
  }
};
