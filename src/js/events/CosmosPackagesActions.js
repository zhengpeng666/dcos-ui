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

const CosmosPackagesActions = {

  fetchAvailablePackages: function (query) {
    let contentType = Config.cosmosContentType.replace('{action}', 'search');
    RequestUtil.json({
      contentType: contentType.replace('{actionType}', 'request'),
      headers: {Accept: contentType.replace('{actionType}', 'response')},
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
    let contentType = Config.cosmosContentType.replace('{action}', 'list');
    RequestUtil.json({
      contentType: contentType.replace('{actionType}', 'request'),
      headers: {Accept: contentType.replace('{actionType}', 'response')},
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
    let contentType = Config.cosmosContentType.replace('{action}', 'describe');
    RequestUtil.json({
      contentType: contentType.replace('{actionType}', 'request'),
      headers: {Accept: contentType.replace('{actionType}', 'response')},
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
    let contentType = Config.cosmosContentType.replace('{action}', 'install');
    RequestUtil.json({
      contentType: contentType.replace('{actionType}', 'request'),
      headers: {Accept: contentType.replace('{actionType}', 'response')},
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
    let contentType = Config.cosmosContentType.replace('{action}', 'uninstall');
    RequestUtil.json({
      contentType: contentType.replace('{actionType}', 'request'),
      headers: {Accept: contentType.replace('{actionType}', 'response')},
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
  }

};

if (Config.useFixtures) {
  let packageDescribeFixture =
    require('json!../../../tests/_fixtures/cosmos/package-describe.json');
  let packagesListFixture =
    require('json!../../../tests/_fixtures/cosmos/packages-list.json');
  let packagesSearchFixture =
    require('json!../../../tests/_fixtures/cosmos/packages-search.json');

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
    uninstallPackage: {event: 'success'}
  };

  Object.keys(global.actionTypes.CosmosPackagesActions).forEach(function (method) {
    CosmosPackagesActions[method] = RequestUtil.stubRequest(
      CosmosPackagesActions, 'CosmosPackagesActions', method
    );
  });
}

module.exports = CosmosPackagesActions;
