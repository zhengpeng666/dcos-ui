import {
  REQUEST_COSMOS_PACKAGES_LIST_SUCCESS,
  REQUEST_COSMOS_PACKAGES_SEARCH_ERROR,
  REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
  REQUEST_COSMOS_PACKAGES_LIST_ERROR,
  REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR,
  REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS,
  REQUEST_COSMOS_PACKAGE_INSTALL_ERROR,
  REQUEST_COSMOS_PACKAGE_INSTALL_SUCCESS,
  REQUEST_COSMOS_PACKAGE_UNINSTALL_ERROR,
  REQUEST_COSMOS_PACKAGE_UNINSTALL_SUCCESS
} from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

function getContentType(action, actionType) {
  return `application/vnd.dcos.package.${action}-${actionType}+json;charset=utf-8;version=v1`;
}

const CosmosPackagesActions = {

  fetchAvailablePackages: function (query) {
    RequestUtil.json({
      contentType: getContentType('search', 'request'),
      headers: {Accept: getContentType('search', 'response')},
      method: 'POST',
      url: `${Config.rootUrl}${Config.cosmosAPIPrefix}/search`,
      data: JSON.stringify({query}),
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
          data: response.packages,
          query
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGES_SEARCH_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          query
        });
      }
    });
  },

  fetchInstalledPackages: function (packageName, appId) {
    RequestUtil.json({
      contentType: getContentType('list', 'request'),
      headers: {Accept: getContentType('list', 'response')},
      method: 'POST',
      url: `${Config.rootUrl}${Config.cosmosAPIPrefix}/list`,
      data: JSON.stringify({packageName, appId}),
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGES_LIST_SUCCESS,
          data: response.packages,
          packageName,
          appId
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGES_LIST_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          packageName,
          appId
        });
      }
    });
  },

  fetchPackageDescription: function (packageName, packageVersion) {
    RequestUtil.json({
      contentType: getContentType('describe', 'request'),
      headers: {Accept: getContentType('describe', 'response')},
      method: 'POST',
      url: `${Config.rootUrl}${Config.cosmosAPIPrefix}/describe`,
      data: JSON.stringify({packageName, packageVersion}),
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS,
          data: response,
          packageName,
          packageVersion
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          packageName,
          packageVersion
        });
      }
    });
  },

  installPackage: function (packageName, packageVersion, appId, options = {}) {
    RequestUtil.json({
      contentType: getContentType('install', 'request'),
      headers: {Accept: getContentType('install', 'response')},
      method: 'POST',
      url: `${Config.rootUrl}${Config.cosmosAPIPrefix}/install`,
      data: JSON.stringify({packageName, packageVersion, appId, options}),
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_INSTALL_SUCCESS,
          data: response,
          packageName,
          packageVersion,
          appId
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_INSTALL_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          packageName,
          packageVersion,
          appId
        });
      }
    });
  },

  uninstallPackage: function (packageName, packageVersion, appId, all = false) {
    RequestUtil.json({
      contentType: getContentType('uninstall', 'request'),
      headers: {Accept: getContentType('uninstall', 'response')},
      method: 'POST',
      url: `${Config.rootUrl}${Config.cosmosAPIPrefix}/uninstall`,
      data: JSON.stringify({packageName, packageVersion, appId, all}),
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_UNINSTALL_SUCCESS,
          data: response,
          packageName,
          packageVersion,
          appId
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_UNINSTALL_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          packageName,
          packageVersion,
          appId
        });
      }
    });
  },

  fetchRepositories: function () {
    let contentType = Config.cosmosContentType.replace('{action}', 'list-source');
    RequestUtil.json({
      contentType: contentType.replace('{actionType}', 'request'),
      headers: {Accept: contentType.replace('{actionType}', 'response')},
      method: 'POST',
      url: `${Config.rootUrl}${Config.cosmosAPIPrefix}/list-source`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_REPOSITORIES_LIST_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_REPOSITORIES_LIST_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  addRepository: function (data) {
    let contentType = Config.cosmosContentType.replace('{action}', 'add-source');
    RequestUtil.json({
      contentType: contentType.replace('{actionType}', 'request'),
      headers: {Accept: contentType.replace('{actionType}', 'response')},
      method: 'POST',
      url: `${Config.rootUrl}${Config.cosmosAPIPrefix}/add-source`,
      data: JSON.stringify(data),
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_REPOSITORY_ADD_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_REPOSITORY_ADD_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  deleteRepository: function (name, url) {
    let contentType = Config.cosmosContentType.replace('{action}', 'delete-source');
    RequestUtil.json({
      contentType: contentType.replace('{actionType}', 'request'),
      headers: {Accept: contentType.replace('{actionType}', 'response')},
      method: 'POST',
      url: `${Config.rootUrl}${Config.cosmosAPIPrefix}/delete-source`,
      data: JSON.stringify({name, url}),
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_REPOSITORY_DELETE_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_REPOSITORY_DELETE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  }

};

if (Config.useFixtures) {
  let packageDescribeFixture =
    require('json!../../../tests/_fixtures/cosmos/package-describe.json');
  let packagesListFixture =
    require('json!../../../tests/_fixtures/cosmos/packages-list.json');
  let packagesSearchFixture =
    require('json!../../../tests/_fixtures/cosmos/packages-search.json');
  let packagesRepositoriesFixture =
    require('json!../../../tests/_fixtures/cosmos/packages-repositories.json');

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.CosmosPackagesActions = {
    fetchPackageDescription:
      {event: 'success', success: {response: packageDescribeFixture}},
    fetchInstalledPackages:
      {event: 'success', success: {response: packagesListFixture}},
    fetchAvailablePackages:
      {event: 'success', success: {response: packagesSearchFixture}},
    installPackage: {event: 'success'},
    uninstallPackage: {event: 'success'},
    fetchRepositories:
      {event: 'success', success: {response: packagesRepositoriesFixture}},
    addRepository: {event: 'success'},
    deleteRepository: {event: 'success'}
  };

  Object.keys(global.actionTypes.CosmosPackagesActions).forEach(function (method) {
    CosmosPackagesActions[method] = RequestUtil.stubRequest(
      CosmosPackagesActions, 'CosmosPackagesActions', method
    );
  });
}

module.exports = CosmosPackagesActions;
