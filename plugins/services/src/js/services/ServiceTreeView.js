import React, {PropTypes} from 'react';

import Application from '../structs/Application';
import EmptyServiceTree from './EmptyServiceTree';
import ServiceFormModal from '../components/modals/ServiceFormModal';
import ServiceGroupFormModal from '../components/modals/ServiceGroupFormModal';
import ServiceSearchFilter from '../components/ServiceSearchFilter';
import ServiceSidebarFilters from '../components/ServiceSidebarFilters';
import ServiceTree from '../structs/ServiceTree';
import ServicesTable from '../components/ServicesTable';
import {
  SERVICE_FORM_MODAL,
  SERVICE_GROUP_FORM_MODAL
} from '../constants/ModalKeys';

import Breadcrumbs from '../../../../../src/js/components/Breadcrumbs';
import FilterBar from '../../../../../src/js/components/FilterBar';
import FilterHeadline from '../../../../../src/js/components/FilterHeadline';

const METHODS_TO_BIND = [
  'resetFilter',
  'handleModal'
];

class ServiceTreeView extends React.Component {

  constructor() {
    super(...arguments);

    this.state = {
      isServiceFormModalShown: false,
      isServiceGroupFormModalShown: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  resetFilter() {
    // Nuke Query Params
  }

  handleModal(id, open) {
    debugger;
    let modalStates = {
      isServiceFormModalShown: SERVICE_FORM_MODAL === id && open,
      isServiceGroupFormModalShown: SERVICE_GROUP_FORM_MODAL === id && open
    };
    this.setState(modalStates);
  }

  getHeadline() {
    const {services} = this.props;

    if (services.filters.searchString) {
      return (
        <ul className="breadcrumb-style-headline list-unstyled list-inline inverse">
          <li className="h4 inverse">
            Showing results for "{services.filters.searchString}"
          </li>
          <li className="h4 clickable" onClick={this.resetFilter}>
            <a className="small">
              (Clear)
            </a>
          </li>
        </ul>
      );
    }

    if (Object.keys(services.filters).length) {
      return (
        <FilterHeadline
          className="breadcrumb-style-headline"
          onReset={this.resetFilter}
          name="Service"
          currentLength={services.filtered.length}
          totalLength={services.all.length} />
      );
    }

    return (
      <Breadcrumbs />
    );
  }

  getModals() {
    const {serviceTree} = this.props;
    // The regular expression `/^(\/.+)$/` is looking for the beginning of the
    // string and matches if the string starts with a `/` and does contain more
    // characters after the slash. This is combined into a group and then
    // replaced with the first group which is the complete string and a `/` is
    // appended. This is needed because in most case a path like
    // `/group/another-group` will be given by `getId` except on root then the
    // return value of `getId` would be `/` so in most cases we want to append a
    // `/` so that the user can begin typing the `id` of their application.
    let baseId = serviceTree.getId().replace(/^(\/.+)$/, '$1/');

    return (
      <div>
        <ServiceGroupFormModal
          open={this.state.isServiceGroupFormModalShown}
          parentGroupId={serviceTree.getId()}
          onClose={this.handleModal.bind(SERVICE_GROUP_FORM_MODAL, false)}/>
        <ServiceFormModal open={this.state.isServiceFormModalShown}
          service={new Application({id: baseId})}
          onClose={this.handleModal.bind(SERVICE_FORM_MODAL, false)}/>
      </div>
    );
  }

  getServiceTreeView() {
    const {services} = this.props;

    return (
      <div className="flex">
        <ServiceSidebarFilters
          countByValue={services.countByFilter}
          filters={services.filters}
          handleFilterChange={this.props.handleFilterChange}
          services={services.all} />
        <div className="flex-grow">
          {this.getHeadline()}
          <FilterBar rightAlignLastNChildren={2}>
            <ServiceSearchFilter
              handleFilterChange={this.props.handleFilterChange}
              filters={services.filters || {}} />
            <button className="button button-stroke button-inverse"
              onClick={this.handleModal.bind(SERVICE_GROUP_FORM_MODAL, true)}>
              Create Group
            </button>
            <button className="button button-success"
              onClick={this.handleModal.bind(SERVICE_FORM_MODAL, true)}>
              Deploy Service
            </button>
          </FilterBar>
          <ServicesTable services={services.filtered}
            isFiltered={!!Object.keys(services.filters).length} />
        </div>
      </div>
    );
  }

  render() {
    const {serviceTree} = this.props;
    let content = null;

    if (serviceTree.getItems().length) {
      content = this.getServiceTreeView();
    } else {
      content = (
        <EmptyServiceTree
          onCreateGroup={this.handleModal.bind(SERVICE_GROUP_FORM_MODAL, true)}
          onCreateService={this.handleModal.bind(SERVICE_FORM_MODAL, true)} />
      );
    }

    return (
      <div>
        {content}
        {this.getModals()}
      </div>
    );
  }
}

const actionPropTypes = PropTypes.shape({
  revertDeployment: PropTypes.func,
  createGroup: PropTypes.func,
  deleteGroup: PropTypes.func,
  editGroup: PropTypes.func,
  createService: PropTypes.func,
  deleteService: PropTypes.func,
  editService: PropTypes.func,
  restartService: PropTypes.func,
  killTasks: PropTypes.func
}).isRequired;

const servicesPropTypes = PropTypes.shape({
  all: PropTypes.array,
  countByFilter: PropTypes.object,
  filters: PropTypes.object,
  filtered: PropTypes.array
}).isRequired;

ServiceTreeView.propTypes = {
  actionErrors: PropTypes.object,
  actions: actionPropTypes,
  pendingActions: PropTypes.object,
  serviceTree: PropTypes.instanceOf(ServiceTree),
  services: servicesPropTypes
};

module.exports = ServiceTreeView;
