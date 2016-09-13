import classNames from 'classnames';
import mixin from 'reactjs-mixin';
import React from 'react';

import Breadcrumbs from './Breadcrumbs';
import Pod from '../structs/Pod';
import PodActionItem from '../constants/PodActionItem';
import PodHeader from './PodHeader';
import ServiceFormModal from './modals/ServiceFormModal';
import TabsMixin from '../mixins/TabsMixin';

const METHODS_TO_BIND = [
  'handleAction',
  'handleCloseDialog'
];

class PodDetail extends mixin(TabsMixin) {
  constructor() {
    super(...arguments);

    this.tabs_tabs = {
      instances: 'Instances',
      configuration: 'Configuration',
      debug: 'Debug'
    };

    this.state = {
      currentTab: Object.keys(this.tabs_tabs).shift(),
      currentActionDialog: null
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleAction(action) {
    switch (action.id) {
      case PodActionItem.SCALE:
        console.debug('Scale');
        break;

      case PodActionItem.EDIT:
        this.setState({
          currentActionDialog: PodActionItem.EDIT
        });
        break;

      case PodActionItem.DESTROY:
        console.debug('Destroy');
        break;
    }
  }

  handleCloseDialog() {
    this.setState({
      currentActionDialog: null
    });
  }

  renderConfigurationTabView() {
    let {pod} = this.props;
    return (
      <pre>
      &lt;PodConfigurationView pod={pod.getId()} /&gt;
      </pre>
    );
  }

  renderDebugTabView() {
    let {pod} = this.props;
    return (
      <pre>
      &lt;PodDebugTabView pod={pod.getId()} /&gt;
      </pre>
    );
  }

  renderInstancesTabView() {
    let {pod} = this.props;
    return (
      <pre>
      &lt;PodInstancesView pod={pod.getId()} /&gt;
      </pre>
    );
  }

  render() {
    const {currentActionDialog} = this.state;
    const {pod} = this.props;

    return (
      <div className="flex-container-col">
        <div className={classNames(
          'container-pod',
          'container-pod-divider-bottom-align-right',
          'container-pod-short-top',
          'flush-bottom',
          'flush-top',
          'media-object-spacing-wrapper',
          'media-object-spacing-narrow'
          )}>
          <Breadcrumbs />
          <PodHeader
            onAction={this.handleAction}
            pod={pod}
            tabs={this.tabs_getUnroutedTabs()}
            />
          {this.tabs_getTabView()}
        </div>
        <ServiceFormModal
          isEdit={true}
          open={currentActionDialog === PodActionItem.EDIT}
          service={pod}
          onClose={this.handleCloseDialog}
          />
      </div>

    );
  }
}

PodDetail.contextTypes = {
  router: React.PropTypes.func
};

PodDetail.propTypes = {
  pod: React.PropTypes.instanceOf(Pod)
};

module.exports = PodDetail;
