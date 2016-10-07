import {DCOSStore} from 'foundation-ui';
import deepEqual from 'deep-equal';
import React, {PropTypes} from 'react';

import ServiceItemNotFound from './ServiceItemNotFound';
import ServicesUtil from '../utils/ServicesUtil';
import ServiceTree from '../structs/ServiceTree';
import ServiceTreeView from './ServiceTreeView';

import AppDispatcher from '../../../../../src/js/events/AppDispatcher';
import Icon from '../../../../../src/js/components/Icon';
import Loader from '../../../../../src/js/components/Loader';
import Page from '../../../../../src/js/components/Page';
import RequestErrorMsg from '../../../../../src/js/components/RequestErrorMsg';
import Util from '../../../../../src/js/utils/Util';

import {
  DCOS_CHANGE
} from '../../../../../src/js/constants/EventTypes';

import {
  MARATHON_DEPLOYMENT_ROLLBACK_ERROR,
  MARATHON_DEPLOYMENT_ROLLBACK_SUCCESS,

  MARATHON_DEPLOYMENTS_CHANGE,
  MARATHON_DEPLOYMENTS_ERROR,

  MARATHON_GROUP_CREATE_ERROR,
  MARATHON_GROUP_CREATE_SUCCESS,

  MARATHON_GROUP_DELETE_ERROR,
  MARATHON_GROUP_DELETE_SUCCESS,

  MARATHON_GROUP_EDIT_ERROR,
  MARATHON_GROUP_EDIT_SUCCESS,

  MARATHON_GROUPS_CHANGE,
  MARATHON_GROUPS_ERROR,

  MARATHON_QUEUE_CHANGE,
  MARATHON_QUEUE_ERROR,

  MARATHON_SERVICE_CREATE_ERROR,
  MARATHON_SERVICE_CREATE_SUCCESS,

  MARATHON_SERVICE_DELETE_ERROR,
  MARATHON_SERVICE_DELETE_SUCCESS,

  MARATHON_SERVICE_EDIT_ERROR,
  MARATHON_SERVICE_EDIT_SUCCESS,

  MARATHON_SERVICE_RESTART_ERROR,
  MARATHON_SERVICE_RESTART_SUCCESS,

  MARATHON_SERVICE_VERSIONS_CHANGE,
  MARATHON_SERVICE_VERSIONS_ERROR,

  MARATHON_TASK_KILL_ERROR,
  MARATHON_TASK_KILL_SUCCESS
} from '../constants/EventTypes';

/**
 * Increments error count for each fetch type when we have a request error and
 * resets to zero when fetch was successful for type
 * @param  {Object} fetchErrors
 * @param  {Object} action
 * @return {Object} updated fetch errors
 */
function countFetchErrors(fetchErrors, action) {

  switch (action.type) {
    case MARATHON_DEPLOYMENTS_ERROR:
    case MARATHON_GROUPS_ERROR:
    case MARATHON_QUEUE_ERROR:
    case MARATHON_SERVICE_VERSIONS_ERROR:
      fetchErrors[action.type] = (fetchErrors[action.type] || 0) + 1;

      return fetchErrors;

    case MARATHON_DEPLOYMENTS_CHANGE:
    case MARATHON_GROUPS_CHANGE:
    case MARATHON_QUEUE_CHANGE:
    case MARATHON_SERVICE_VERSIONS_CHANGE:
      fetchErrors[action.type] = 0;

      return fetchErrors;

    default:
      return false;
  }
};

// Query parameters that need to be converted from
// Array[String] to Array[Int]
const INTEGER_QUERY_ARRAYS = [
  'filterStatus',
  'filterHealth',
  'filterOther'
];

const METHODS_TO_BIND = [
  'handleServerAction',
  'handleFilterChange',
  'clearFilters',
  'createGroup',
  'revertDeployment',
  'deleteGroup',
  'editGroup',
  'createService',
  'deleteService',
  'editService',
  'restartService',
  'killTasks',
  'onStoreChange',
  'setQueryParams'
];

class ServicesContainer extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      actionErrors: {},
      fetchErrors: {},
      filters: {},
      isLoading: true,
      lastUpdate: 0,
      pendingActions: {},
      isServiceFormModalShown: false,
      isServiceGroupFormModalShown: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    DCOSStore.addChangeListener(DCOS_CHANGE, this.onStoreChange);

    // Listen for server actions so we can update state immediately
    // on the completion of an API request.
    this.dispatcher = AppDispatcher.register(this.handleServerAction);
  }

  componentWillMount() {
    this.propsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.propsToState(nextProps);
  }

  componentWillUnmount() {
    AppDispatcher.unregister(this.dispatcher);

    DCOSStore.removeChangeListener(DCOS_CHANGE, this.onStoreChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextFilters = this.filtersFromQuery(nextProps.query);

    return !deepEqual(nextState, this.state)
      || !deepEqual(nextProps, this.props)
      || !deepEqual(nextFilters, nextState.filters);
  }

  filtersFromQuery(query) {
    return Object.keys(query).reduce(function (memo, filterKey) {
      const value = query[filterKey];

      const mapToInts = INTEGER_QUERY_ARRAYS.includes(filterKey)
        && Array.isArray(value);

      if (value != null && value.length > 0) {
        if (mapToInts) {
          // Our ServiceTree filtering and SidebarFilter components
          // expect Arrays of Int's
          memo[filterKey] = value.map(function (val) {
            return parseInt(val, 10);
          });
        } else {
          memo[filterKey] = value;
        }
      }

      if (filterKey === 'filterLabels') {
        try {
          memo[filterKey] = value.map(function (label) {
            const [key, val] = label.split(';');

            return {key, value: val};
          });
        } catch (e) {
          // Delete so filters cannot be tempted to use in a broken state
          delete memo[filterKey];
        }
      }

      return memo;
    }, {});
  }

  propsToState(props) {
    const itemId = decodeURIComponent(props.params.id || '/');
    const filters = this.filtersFromQuery(props.query);

    this.setState({
      itemId,
      filters
    });
  }

  onStoreChange() {
    // Throttle updates from DCOSStore
    if (Date.now() - this.state.lastUpdate > 1000
      || (!!DCOSStore.dataProcessed && this.state.isLoading)) {

      this.setState({
        isLoading: !(!!DCOSStore.dataProcessed),
        lastUpdate: Date.now()
      });
    }
  }

  revertDeployment() {
    this.setPendingAction('revertDeployment');

    return MarathonActions.revertDeployment(...arguments);
  }

  createGroup() {
    this.setPendingAction('groupCreate');

    return MarathonActions.createGroup(...arguments);
  }

  deleteGroup() {
    this.setPendingAction('groupDelete');

    return MarathonActions.deleteGroup(...arguments);
  }

  editGroup() {
    this.setPendingAction('groupEdit');

    return MarathonActions.editGroup(...arguments);
  }

  createService() {
    this.setPendingAction('serviceCreate');

    return MarathonActions.createService(...arguments);
  }

  deleteService() {
    this.setPendingAction('serviceDelete');

    return MarathonActions.deleteService(...arguments);
  }

  editService() {
    this.setPendingAction('serviceEdit');

    return MarathonActions.editService(...arguments);
  }

  restartService() {
    this.setPendingAction('serviceRestart');

    return MarathonActions.restartService(...arguments);
  }

  killTasks() {
    this.setPendingAction('taskKill');

    return MarathonActions.killTasks(...arguments);
  }

  handleServerAction(payload) {
    const {action} = payload;

    // Increment/clear fetching errors based on action
    const fetchErrors = countFetchErrors(
      Object.assign({}, this.state.fetchErrors), action
    );

    // Only set state if fetchErrors changed
    if (fetchErrors) {
      this.setState({fetchErrors});
    }

    switch (action.type) {
      case MARATHON_DEPLOYMENT_ROLLBACK_ERROR:
        this.unsetPendingAction('revertDeployment', action.data);
        break;
      case MARATHON_DEPLOYMENT_ROLLBACK_SUCCESS:
        this.unsetPendingAction('revertDeployment');
        this.fetchData();
        break;

      case MARATHON_GROUP_CREATE_ERROR:
        this.unsetPendingAction('groupCreate', action.data);
        break;
      case MARATHON_GROUP_CREATE_SUCCESS:
        this.unsetPendingAction('groupCreate');
        this.fetchData();
        break;

      case MARATHON_GROUP_DELETE_ERROR:
        this.unsetPendingAction('groupDelete', action.data);
        break;
      case MARATHON_GROUP_DELETE_SUCCESS:
        this.unsetPendingAction('groupDelete');
        this.fetchData();
        break;

      case MARATHON_GROUP_EDIT_ERROR:
        this.unsetPendingAction('groupEdit', action.data);
        break;
      case MARATHON_GROUP_EDIT_SUCCESS:
        this.unsetPendingAction('groupEdit');
        this.fetchData();
        break;

      case MARATHON_SERVICE_CREATE_ERROR:
        this.unsetPendingAction('serviceCreate', action.data);
        break;
      case MARATHON_SERVICE_CREATE_SUCCESS:
        this.unsetPendingAction('serviceCreate');
        this.fetchData();
        break;

      case MARATHON_SERVICE_DELETE_ERROR:
        this.unsetPendingAction('serviceDelete', action.data);
        break;
      case MARATHON_SERVICE_DELETE_SUCCESS:
        this.unsetPendingAction('serviceDelete');
        this.fetchData();
        break;

      case MARATHON_SERVICE_EDIT_ERROR:
        this.unsetPendingAction('serviceEdit', action.data);
        break;
      case MARATHON_SERVICE_EDIT_SUCCESS:
        this.unsetPendingAction('serviceEdit');
        this.fetchData();
        break;

      case MARATHON_SERVICE_RESTART_ERROR:
        this.unsetPendingAction('serviceRestart', action.data);
        break;
      case MARATHON_SERVICE_RESTART_SUCCESS:
        this.unsetPendingAction('serviceRestart');
        this.fetchData();
        break;

      case MARATHON_TASK_KILL_ERROR:
        this.unsetPendingAction('taskKill', action.data);
        break;
      case MARATHON_TASK_KILL_SUCCESS:
        this.unsetPendingAction('taskKill');
        this.fetchData();
        break;
    }
  }

  fetchData() {
    // Re-fetch data - this will end up being a single Relay request
  }
  /**
   * Sets or clears error for actionType
   * @param  {String} actionType
   * @param  {Any} error
   * @return {Object} updated action errors
   */
  adjustActionErrors(actionType, error = null) {
    const {actionErrors} = this.state;
    // Set error for actionType
    return Object.assign(
      {},
      actionErrors,
      {[`${actionType}Error`]: error}
    );
  }
  /**
   * Sets pending action to true/false
   * @param  {String}  actionType
   * @param  {Boolean} isPending
   * @return {Object} updated pending actions
   */
  adjustPendingActions(actionType, isPending) {
    const {pendingActions} = this.state;

    return Object.assign(
      {},
      pendingActions,
      {[actionType]: isPending}
    );
  }
  /**
   * Sets the actionType to pending in state which will in turn be pushed
   * to children components as a prop. Also clears any existing error for
   * the actionType
   * @param {String} actionType
   */
  setPendingAction(actionType) {
    this.setState({
      actionErrors: this.adjustActionErrors(actionType, null),
      pendingActions: this.adjustPendingActions(actionType, true)
    });
  }
  /**
   * Sets the pending actionType to false in state which will in turn be
   * pushed down to children via props. Can optional set an error for the
   * actionType
   * @param  {String} actionType
   * @param  {Any} error
   */
  unsetPendingAction(actionType, error = null) {
    this.setState({
      actionErrors: this.adjustActionErrors(actionType, error),
      pendingActions: this.adjustPendingActions(actionType, false)
    });
  }

  getServices(serviceTree) {
    const {filters} = this.state;

    if (filters.searchString) {
      serviceTree = serviceTree.filterItemsByFilter({
        id: filters.searchString
      });
    }

    const all = serviceTree.flattenItems().getItems();
    const countByFilter = ServicesUtil.getCountByType(all);

    let filtered = serviceTree.getItems();

    if (Object.keys(filters).length
      && !(Object.keys(filters).length === 1 && filters.searchString)) {

      filtered = serviceTree.filterItemsByFilter({
        health: filters.filterHealth,
        labels: filters.filterLabels,
        other: filters.filterOther,
        status: filters.filterStatus
      });

      if (!filters.searchString) {
        filtered = filtered.flattenItems();
      }
      filtered = filtered.getItems();
    }

    return {
      all,
      countByFilter,
      filtered
    };
  }

  handleFilterChange(filterType, filterValue) {
    const filters = Object.assign(
      {},
      this.state.filters,
      {[filterType]: filterValue}
    );

    // Delete filter key if value is null
    if (!filterValue || !filterValue.length) {
      delete filters[filterType];
    }

    this.setState({filters}, this.setQueryParams);
  }

  clearFilters() {
    this.setState({filters: {}}, this.setQueryParams);
  }

  setQueryParams() {
    const {router} = this.context;
    let filters = Object.assign({}, this.state.filters);
    // Transform labels filter so it is easily decoded again
    if (filters.filterLabels) {
      filters.filterLabels = filters.filterLabels.map(function (label) {
        return `${label.key};${label.value}`;
      });
    }

    router.transitionTo(router.getCurrentPathname(), {}, filters);
  }

  getActions() {
    return {
      revertDeployment: this.revertDeployment,
      createGroup: this.createGroup,
      deleteGroup: this.deleteGroup,
      editGroup: this.editGroup,
      createService: this.createService,
      deleteService: this.deleteService,
      editService: this.editService,
      restartService: this.restartService,
      killTasks: this.killTasks
    };
  }

  getContent() {
    const {
      fetchErrors,
      filters,
      isLoading,
      itemId
    } = this.state;

    let item;
    // Find item in root tree
    if (itemId === '/') {
      item = DCOSStore.serviceTree;
    } else {
      item = DCOSStore.serviceTree.findItemById(itemId);
    }

    // Check if a single endpoint has failed more than 3 times
    const fetchError = Object.values(fetchErrors).some(function (errorCount) {
      return errorCount > 3;
    });

    // Still Loading
    if (isLoading) {
      return <Loader />;
    }

    // API Failures
    if (fetchError) {
      return <RequestErrorMsg />;
    }

    // Show Tree
    if (item instanceof ServiceTree) {
      const {
        all,
        countByFilter,
        filtered
      } = this.getServices(item);

      const services = {
        countByFilter: countByFilter,
        filtered: filtered,
        all,
        filters
      };

      return (
        <ServiceTreeView
          actions={this.getActions()}
          actionErrors={this.state.actionErrors}
          clearFilters={this.clearFilters}
          handleFilterChange={this.handleFilterChange}
          serviceTree={item}
          services={services}
          pendingActions={this.state.pendingActions} />
      );
    }
    // Not found
    return (
      <ServiceItemNotFound
        message={`Service '${itemId}' was not found.`} />
    );
  }

  render() {
    return <Page title="Services">{this.getContent()}</Page>;
  }
}

ServicesContainer.propTypes = {
  params: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired
};

ServicesContainer.contextTypes = {
  router: React.PropTypes.func
};

ServicesContainer.routeConfig = {
  label: 'Services',
  icon: <Icon id="services-inverse" size="small" family="small" />,
  matches: /^\/services/
};

module.exports = ServicesContainer;
