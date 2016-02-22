import {
  REQUEST_HEALTH_COMPONENTS_SUCCESS,
  REQUEST_HEALTH_COMPONENTS_ERROR,
  REQUEST_HEALTH_COMPONENT_SUCCESS,
  REQUEST_HEALTH_COMPONENT_ERROR,
  REQUEST_HEALTH_COMPONENT_NODES_SUCCESS,
  REQUEST_HEALTH_COMPONENT_NODES_ERROR,
  REQUEST_HEALTH_COMPONENT_NODE_SUCCESS,
  REQUEST_HEALTH_COMPONENT_NODE_ERROR
} from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

const ComponentHealthActions = {

  fetchComponents: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.componentHealthAPIPrefix}/components`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_HEALTH_COMPONENTS_SUCCESS,
          data: response.array
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_HEALTH_COMPONENTS_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  fetchComponent: function (componentID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.componentHealthAPIPrefix}/components/${componentID}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_HEALTH_COMPONENT_SUCCESS,
          data: response,
          componentID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_HEALTH_COMPONENT_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          componentID
        });
      }
    });
  },

  fetchComponentNodes: function (componentID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.componentHealthAPIPrefix}/components/${componentID}/nodes`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_HEALTH_COMPONENT_NODES_SUCCESS,
          data: response,
          componentID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_HEALTH_COMPONENT_NODES_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          componentID
        });
      }
    });
  },

  fetchComponentNode: function (componentID, nodeID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.componentHealthAPIPrefix}/components/${componentID}/nodes/${nodeID}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_HEALTH_COMPONENT_NODE_SUCCESS,
          data: response,
          componentID,
          nodeID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_HEALTH_COMPONENT_NODE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          componentID,
          nodeID
        });
      }
    });
  }
};

if (Config.useFixtures) {
  let componentsFixture = require('json!../../../tests/_fixtures/component-health/components.json');
  let componentFixture = require('json!../../../tests/_fixtures/component-health/component.json');
  let componentNodesFixture = require('json!../../../tests/_fixtures/component-health/component-nodes.json');
  let componentNodeFixture = require('json!../../../tests/_fixtures/component-health/component-node.json');

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.ComponentHealthActions = {
    fetchComponents: {
      event: 'success', success: {response: componentsFixture}
    },
    fetchComponent: {events: 'success', success: {response: componentFixture}},
    fetchComponentNodes: {
      events: 'success', success: {response: componentNodesFixture}
    },
    fetchComponentNode: {
      events: 'success', success: {response: componentNodeFixture}
    }
  };

  Object.keys(global.actionTypes.ComponentHealthActions).forEach(function (method) {
    ComponentHealthActions[method] = RequestUtil.stubRequest(
      ComponentHealthActions, 'ComponentHealthActions', method
    );
  });
}

module.exports = ComponentHealthActions;
