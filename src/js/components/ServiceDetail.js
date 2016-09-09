import mixin from 'reactjs-mixin';
import React from 'react';
import Relay from 'react-relay';

import Breadcrumbs from './Breadcrumbs';
import InternalStorageMixin from '../mixins/InternalStorageMixin';
import Service from '../structs/Service';
import ServiceActionItem from '../constants/ServiceActionItem';
import ServiceDestroyModal from './modals/ServiceDestroyModal';
import ServiceDetailConfigurationTab from './ServiceDetailConfigurationTab';
import ServiceDetailDebugTab from './ServiceDetailDebugTab';
import ServiceDetailTaskTab from './ServiceDetailTaskTab';
import ServiceFormModal from './modals/ServiceFormModal';
import ServiceInfo from './ServiceInfo';
import ServiceRestartModal from './modals/ServiceRestartModal';
import ServiceSuspendModal from './modals/ServiceSuspendModal';
import ServiceScaleFormModal from './modals/ServiceScaleFormModal';
import TabsMixin from '../mixins/TabsMixin';
import VolumeTable from './VolumeTable';

const METHODS_TO_BIND = [
  'closeDialog',
  'onActionsItemSelection',
  'onServiceDestroyModalClose'
];

class ServiceDetail extends mixin(InternalStorageMixin, TabsMixin) {
  constructor() {
    super(...arguments);

    this.tabs_tabs = {
      tasks: 'Tasks',
      configuration: 'Configuration',
      debug: 'Debug'
    };

    this.state = {
      currentTab: Object.keys(this.tabs_tabs).shift(),
      serviceActionDialog: null
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    this.checkForVolumes();
  }

  componentWillUpdate() {
    super.componentWillUpdate(...arguments);
    this.checkForVolumes();
  }

  onActionsItemSelection(item) {
    this.setState({serviceActionDialog: item.id});
  }

  onServiceDestroyModalClose() {
    this.closeDialog();
    this.context.router.transitionTo('services-page');
  }

  closeDialog() {
    this.setState({serviceActionDialog: null});
  }

  getServiceScaleFormModal() {
    return (
      <ServiceScaleFormModal
        open={this.state.serviceActionDialog === ServiceActionItem.SCALE}
        service={this.props.service}
        onClose={this.closeDialog} />
    );
  }

  checkForVolumes() {
    return;
    // Add the Volumes tab if it isn't already there and the service has
    // at least one volume.
    if (this.tabs_tabs.volumes == null && !!this.props.service
      && this.props.service.getVolumes().getItems().length > 0) {
      this.tabs_tabs.volumes = 'Volumes';
      this.forceUpdate();
    }
  }

  renderConfigurationTabView() {
    return (
      <ServiceDetailConfigurationTab service={this.props.service} />
    );
  }

  renderDebugTabView() {
    return (
      <ServiceDetailDebugTab service={this.props.service}/>
    );
  }

  renderVolumesTabView() {
    return (
      <VolumeTable
        params={this.context.router.getCurrentParams()}
        service={this.props.service}
        volumes={this.props.service.getVolumes().getItems()} />
    );
  }

  renderTasksTabView() {
    return (
      <ServiceDetailTaskTab service={this.props.service} />
    );
  }

  render() {
    const {service} = this.props;
    let {serviceActionDialog} = this.state;
    // Haven't mapped all schema attributes and subcomponents still expect instance of Service struct.
    service = new Service(service);

    return (
      <div className="flex-container-col">
        <div className="container-pod
          container-pod-divider-bottom-align-right
          container-pod-short-top flush-bottom flush-top
          service-detail-header media-object-spacing-wrapper
          media-object-spacing-narrow">
          <Breadcrumbs />
          <ServiceInfo onActionsItemSelection={this.onActionsItemSelection}
            service={service} tabs={this.tabs_getUnroutedTabs()} />
          {this.tabs_getTabView()}
        </div>
        <ServiceFormModal isEdit={true}
          open={serviceActionDialog === ServiceActionItem.EDIT}
          service={service}
          onClose={this.closeDialog} />
        <ServiceDestroyModal
          onClose={this.onServiceDestroyModalClose}
          open={serviceActionDialog === ServiceActionItem.DESTROY}
          service={service} />
        <ServiceRestartModal
          onClose={this.closeDialog}
          open={serviceActionDialog === ServiceActionItem.RESTART}
          service={service} />
        {this.getServiceScaleFormModal()}
        <ServiceSuspendModal
          onClose={this.closeDialog}
          open={serviceActionDialog === ServiceActionItem.SUSPEND}
          service={service} />
      </div>

    );
  }
}

ServiceDetail.contextTypes = {
  router: React.PropTypes.func
};

ServiceDetail.propTypes = {
  service: React.PropTypes.object
};

module.exports = Relay.createContainer(ServiceDetail, {
  // For each of the props that depend on server data, we define a corresponding
  // key in `fragments`. Here, the component expects server data to populate the
  // `service` prop, so we'll specify the fragment from above as `fragments.service`.
  fragments: {
    service: () => Relay.QL`
      fragment on Service {
        id
        username
      }
    `
  }
});
