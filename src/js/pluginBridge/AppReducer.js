import {APP_STORE_CHANGE} from '../constants/EventTypes';
import {APPLICATION} from '../constants/PluginConstants';
import StructUtil from '../utils/StructUtil';

const initialState = {};

// Compute new state based on action
function updateState(prevState, action) {
  // Peel away Structs and assign to State tree rooted at storeID
  let newState = {
    [action.storeID]: StructUtil.copyRawObject(action.data)
  };
  // Clone everything
  return Object.assign({}, prevState, newState);
}

// Clones state from application stores and maps it into the OmniStore
module.exports = function (state = initialState, action) {
  // Return early if the action didn't come from the application dispatcher
  if (action.__origin !== APPLICATION) {
    return state;
  }

  switch (action.type) {
    case APP_STORE_CHANGE:
      return updateState(state, action);
    default:
      return state;
  }
};
