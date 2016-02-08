import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

const CosmosPackagesActions = {

  search: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.cosmosAPIPrefix}/packages/search`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
          data: response.packages
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  }

};

export default CosmosPackagesActions;
