import {DCOSStore} from 'foundation-ui';
import React from 'react';

import ServiceItemNotFound from './ServiceItemNotFound';
import ServiceTreeView from './ServiceTreeView';
// import Config from '../../../../../src/js/config/Config';
import AppDispatcher from '../../../../../src/js/events/AppDispatcher';
import Loader from '../../../../../src/js/components/Loader';
import Page from '../../../../../src/js/components/Page';
import RequestErrorMsg from '../../../../../src/js/components/RequestErrorMsg';

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

const METHODS_TO_BIND = [
  'handleServerAction',
  'updateState',
  'createGroup',
  'revertDeployment',
  'deleteGroup',
  'editGroup',
  'createService',
  'deleteService',
  'editService',
  'restartService',
  'killTasks'
];

const DEFAULT_FILTER_OPTIONS = {
  filterHealth: null,
  filterOther: null,
  filterStatus: null,
  filterLabels: null,
  searchString: ''
};

class ServiceTreeContainer extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      actionErrors: {},
      fetchErrors: {},
      isLoading: true,
      pendingActions: {}
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    DCOSStore.addChangeListener(DCOS_CHANGE, this.updateState);

    // Listen for server actions so we can update state immediately
    // on the completion of an API request.
    this.dispatcher = AppDispatcher.register(this.handleServerAction);
  }

  componentWillUnmount() {
    AppDispatcher.unregister(this.dispatcher);

    DCOSStore.removeChangeListener(DCOS_CHANGE, this.updateState);
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
    const {action, source} = payload;

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
        this.updateState();
        break;

      case MARATHON_GROUP_CREATE_ERROR:
        this.unsetPendingAction('groupCreate', action.data);
        break;
      case MARATHON_GROUP_CREATE_SUCCESS:
        this.unsetPendingAction('groupCreate');
        this.updateState();
        break;

      case MARATHON_GROUP_DELETE_ERROR:
        this.unsetPendingAction('groupDelete', action.data);
        break;
      case MARATHON_GROUP_DELETE_SUCCESS:
        this.unsetPendingAction('groupDelete');
        this.updateState();
        break;

      case MARATHON_GROUP_EDIT_ERROR:
        this.unsetPendingAction('groupEdit', action.data);
        break;
      case MARATHON_GROUP_EDIT_SUCCESS:
        this.unsetPendingAction('groupEdit');
        this.updateState();
        break;

      case MARATHON_SERVICE_CREATE_ERROR:
        this.unsetPendingAction('serviceCreate', action.data);
        break;
      case MARATHON_SERVICE_CREATE_SUCCESS:
        this.unsetPendingAction('serviceCreate');
        this.updateState();
        break;

      case MARATHON_SERVICE_DELETE_ERROR:
        this.unsetPendingAction('serviceDelete', action.data);
        break;
      case MARATHON_SERVICE_DELETE_SUCCESS:
        this.unsetPendingAction('serviceDelete');
        this.updateState();
        break;

      case MARATHON_SERVICE_EDIT_ERROR:
        this.unsetPendingAction('serviceEdit', action.data);
        break;
      case MARATHON_SERVICE_EDIT_SUCCESS:
        this.unsetPendingAction('serviceEdit');
        this.updateState();
        break;

      case MARATHON_SERVICE_RESTART_ERROR:
        this.unsetPendingAction('serviceRestart', action.data);
        break;
      case MARATHON_SERVICE_RESTART_SUCCESS:
        this.unsetPendingAction('serviceRestart');
        this.updateState();
        break;

      case MARATHON_TASK_KILL_ERROR:
        this.unsetPendingAction('taskKill', action.data);
        break;
      case MARATHON_TASK_KILL_SUCCESS:
        this.unsetPendingAction('taskKill');
        this.updateState();
        break;
    }
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

  applyServiceFilters(serviceTree) {
    const {query} = this.props;
    const {state} = this;

    const appliedFilters = Object.keys(DEFAULT_FILTER_OPTIONS)
      .reduce(function (filterKey, memo) {
        if (query[filterKey] != null && query[filterKey].length > 0) {
          memo[filterKey];
        }

        return memo;
      }, {});

    if (state.searchString) {
      serviceTree = serviceTree.filterItemsByFilter({
        id: state.searchString
      });
    }

    let allServices = serviceTree.flattenItems().getItems();
    let filteredServices = serviceTree.getItems();

    if (appliedFilters) {
      filteredServices = serviceTree.filterItemsByFilter({
        health: state.filterHealth,
        labels: state.filterLabels,
        other: state.filterOther,
        status: state.filterStatus
      });

      if (!state.searchString) {
        filteredServices = filteredServices.flattenItems();
      }

      filteredServices = filteredServices.getItems();

      return {
        allServices,
        appliedFilters,
        filteredServices
      };
    }
  }
  /*
    Update all state so we push new values to child components
   */
  updateState() {
    const {groupId} = this.props;
    let group;
    // Find group in root tree
    if (groupId === '/') {
      group = DCOSStore.serviceTree;
    } else {
      group = DCOSStore.serviceTree.findItemById(groupId);
    }

    const {
      allServices,
      appliedFilters,
      filteredServices
    } = this.applyServiceFilters(group);

    this.setState({
      allServices,
      appliedFilters,
      filteredServices,
      isLoading: !(!!DCOSStore.dataProcessed),
      group
    });
  }

  getContent() {
    const {
      fetchErrors,
      isLoading,
      group
    } = this.state;

    // Check if a single endpoint has failed more than 3 times
    const fetchError = Object.values(fetchErrors).some(function(errorCount) {
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
    if (group) {
      const actions = {
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
      return null;
      // return (
      //   <ServiceTreeView
      //     actions={actions}
      //     actionErrors={this.state.actionErrors}
      //     serviceTree={group}
      //     pendingActions={this.state.pendingActions} />
      // );
    }
    // Not found
    return (
      <ServiceItemNotFound
        message={`Group '${this.props.groupId}' was not found.`} />
    );
  }

  render() {
    return <Page title="Services">{this.getContent()}</Page>;
  }
}

ServiceTreeContainer.propTypes = {
  params: React.propTypes.object.isRequired,
  query: React.propTypes.object.isRequired
};

module.exports = ServiceTreeContainer;
