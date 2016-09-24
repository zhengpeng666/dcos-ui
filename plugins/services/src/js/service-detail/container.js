import {DCOSStore} from 'foundation-ui';
import React from 'react';

import Config from '../../../../../src/js/config/Config';
import Icon from '../../../../../src/js/components/Icon';
import Page from '../../../../../src/js/components/Page';
import Loader from '../../../../../src/js/components/Loader';
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

  MARATHON_SERVICE_VERSION_ERROR,

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
 * @return {Object}
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

class ServicesContainer extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      actionErrors: {},
      fetchErrors: {},
      pendingActions: {}
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    DCOSStore.addChangeListener(DCOS_CHANGE, this.updateState);

    // Listen for server actions so we can update state immediately
    // on the completion of an API request.
    this.dispatcher = AppDispatcher.register(payload, this.handleServerAction);
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

    if (source !== SERVER_ACTION) {
      return false;
    }
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
   * @return {Object}
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
   * @return {Object}
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
  /*
    Update all state so we push new values to child components
   */
  updateState() {
    let id = decodeURIComponent(this.props.params.id);
    // Find item in root tree
    let item = DCOSStore.serviceTree.findItemById(id) || DCOSStore.serviceTree;

    const itemNotFound = id
      && this.props.params.id !== '/'
      && !(!!DCOSStore.serviceTree.findItemById(id));

    this.setState({
      isLoading: !DCOSStore.dataProcessed,
      itemNotFound,
      item
    });
  }

  render() {
    const {
      fetchErrors,
      isLoading,
      itemNotFound
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
    // Not found
    if (itemNotFound) {
      return <ServiceItemNotFound />;
    }
  }
}

// var ServicesPage = React.createClass({

//   mixins: [TabsMixin, StoreMixin],

//   displayName: 'ServicesPage',

//   getInitialState() {
//     return {
//       currentTab: 'services-page'
//     };
//   },

//   componentWillMount() {
//     this.store_listeners = [
//       {name: 'notification', events: ['change'], suppressUpdate: false}
//     ];
//     this.tabs_tabs = {
//       'services-page': 'Services',
//       'services-deployments': 'Deployments'
//     };
//     this.updateCurrentTab();
//   },

//   componentDidUpdate() {
//     this.updateCurrentTab();
//   },

//   updateCurrentTab() {
//     let routes = this.context.router.getCurrentRoutes();
//     let currentTab = routes[routes.length - 1].name;
//     // `services-page` tab also contains routes for 'services-details'
//     if (currentTab === 'services-detail' || currentTab == null) {
//       currentTab = 'services-page';
//     }

//     if (this.state.currentTab !== currentTab) {
//       this.setState({currentTab});
//     }
//   },

//   getNavigation() {
//     if (RouterUtil.shouldHideNavigation(this.context.router)) {
//       return null;
//     }

//     return (
//       <ul className="menu-tabbed inverse">
//         {this.tabs_getRoutedTabs()}
//       </ul>
//     );
//   },

//   render() {
//     // Make sure to grow when logs are displayed
//     let routes = this.context.router.getCurrentRoutes();

//     return (
//       <Page
//         navigation={this.getNavigation()}
//         dontScroll={routes[routes.length - 1].dontScroll}
//         title="Services">
//         <RouteHandler />
//       </Page>
//     );
//   }

// });

/*
  These will vanish when we use our new Route Service.
 */
ServicesPage.contextTypes: {
  router: React.PropTypes.func
};

ServicesPage.routeConfig = {
  label: 'Services',
  icon: <Icon id="services-inverse" size="small" family="small" />,
  matches: /^\/services/
};

module.exports = ServicesPage;
