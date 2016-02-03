import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react/addons';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import MesosSummaryStore from '../stores/MesosSummaryStore';

class ClusterName extends mixin(StoreMixin) {
  constructor() {
    super();
    this.state = {};

    this.store_listeners = [{
      name: 'summary',
      events: ['success'],
      listenAlways: false
    }];
  }

  render() {
    let states = MesosSummaryStore.get('states');
    let clusterName = '';

    if (states) {
      let lastState = states.lastSuccessful();

      if (lastState) {
        clusterName = lastState.getClusterName();
      }
    }

    return (
      <h3 className="sidebar-header-label flush-top text-align-center text-overflow flush-bottom" title={clusterName}>
        {clusterName}
      </h3>
    );
  }
}

module.exports = ClusterName;
