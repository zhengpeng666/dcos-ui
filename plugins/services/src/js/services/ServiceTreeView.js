import React, {PropTypes} from 'react';

import EmptyServiceTree from './EmptyServiceTree';
import ServiceTree from '../structs/ServiceTree';

class ServiceTreeView extends React.Component {

  constructor() {
    super(...arguments);

    this.state = Object.assign({}, DEFAULT_FILTER_OPTIONS, {
      marathonErrorCount: 0,
      isServiceGroupFormModalShown: false,
      isServiceFormModalShown: false
    });
  }

  getHeadline(services, filteredServices, hasFiltersApplied) {
    if (this.state.searchString) {
      return (
        <ul className="breadcrumb-style-headline list-unstyled list-inline inverse">
          <li className="h4 inverse">
            Showing results for "{this.state.searchString}"
          </li>
          <li className="h4 clickable" onClick={this.resetFilter}>
            <a className="small">
              (Clear)
            </a>
          </li>
        </ul>
      );
    }

    if (hasFiltersApplied) {
      return (
        <FilterHeadline
          className="breadcrumb-style-headline"
          onReset={this.resetFilter}
          name="Service"
          currentLength={filteredServices.length}
          totalLength={services.length} />
      );
    }

    return (
      <Breadcrumbs />
    );
  }

  getServiceTreeView(serviceTree) {


    return (
      <div className="flex">
        <ServiceSidebarFilters
          handleFilterChange={this.handleFilterChange}
          services={allServices} />
        <div className="flex-grow">
          {this.getHeadline(allServices, filteredServices, hasFiltersApplied)}
          <FilterBar rightAlignLastNChildren={2}>
            <ServiceSearchFilter
              handleFilterChange={this.handleFilterChange} />
            <button className="button button-stroke button-inverse"
              onClick={() => this.handleOpenModal(SERVICE_GROUP_FORM_MODAL)}>
              Create Group
            </button>
            <button className="button button-success"
              onClick={() => this.handleOpenModal(SERVICE_FORM_MODAL)}>
              Deploy Service
            </button>
          </FilterBar>
          <ServicesTable services={filteredServices}
            isFiltered={hasFiltersApplied} />
        </div>
      </div>
    );
  }

  render() {
    const {serviceTree} = this.props;

    if (!serviceTree.getItems().length) {
      return (
        <EmptyServiceTree
          onCreateGroup={this.openGroupCreate}
          onCreateService={this.openServiceCreate} />
      );
    }
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

ServiceTreeView.propTypes = {
  actionErrors: PropTypes.object,
  actions: actionPropTypes,
  pendingActions: PropTypes.object,
  serviceTree: PropTypes.instanceOf(ServiceTree)
};

module.exports = ServiceTreeView;
