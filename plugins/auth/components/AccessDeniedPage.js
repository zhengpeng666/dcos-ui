import React from 'react';

import _ACLAuthActions from '../actions/ACLAuthActions';

const METHODS_TO_BIND = [
  'handleUserLogout'
];

module.exports = (PluginSDK) => {

  let AlertPanel = PluginSDK.get('AlertPanel');

  let ACLAuthActions = _ACLAuthActions(PluginSDK);

  let AccessDeniedPage = class AccessDeniedPage extends React.Component {
    constructor() {
      super(...arguments);

      METHODS_TO_BIND.forEach((method) => {
        this[method] = this[method].bind(this);
      });
    }

    handleUserLogout() {
      ACLAuthActions.logout();
    }

    getFooter() {
      return (
        <button className="button button-primary"
          onClick={this.handleUserLogout}>
          Log out
        </button>
      );
    }

    render() {
      return (
        <div className="flex-container-col">
          <div className="page-content container-scrollable inverse">
            <div className="container container-fluid container-pod
              flex-container-col">
              <AlertPanel
                footer={this.getFooter()}
                iconClassName="icon icon-sprite icon-sprite-jumbo
                  icon-sprite-jumbo-white icon-lost-planet flush-top"
                title="Access Denied">
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
  };
  return AccessDeniedPage;
};
