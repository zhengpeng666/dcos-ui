/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

import RequestErrorMsg from './RequestErrorMsg';
import SidePanelContents from './SidePanelContents';

module.exports = class UserSidePanelContents extends SidePanelContents {
  constructor() {
    super();
  }

  getErrorNotice() {
    return (
      <div className="container container-pod">
        <RequestErrorMsg />
      </div>
    );
  }

  render() {
    return (
      <div className="flex-container-col">
        <div className="container container-fluid container-pod
          container-pod-divider-bottom container-pod-divider-bottom-align-right
          container-pod-divider-inverse container-pod-short-top
          side-panel-content-header side-panel-section flush-bottom">
          Info
        </div>
      </div>
    );
  }
};
