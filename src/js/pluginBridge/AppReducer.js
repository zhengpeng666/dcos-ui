import {
  APP_NAMESPACE,
  APP_STORE_CHANGE
} from '../constants/EventTypes';

import Util from '../utils/Util';
import List from '../structs/List';
import Item from '../structs/Item';
/**
 * Recursively peels open Structs to get raw data
 * @param  {Object} obj Object where structs will be striped from
 * @return {Object}     Object without Structs
 */
function getRawObject(obj) {
  // Extract underlying array object
  if (obj instanceof List) {
    return getRawObject(obj.getItems());
  }
  // Extract underlying storage Object
  if (obj instanceof Item) {
    return getRawObject(obj._itemData);
  }
  // Make sure Array items aren't structs
  if (Util.isArray(obj)) {
    return obj.map(getRawObject);
  }
  // Make sure Object values aren't structs
  if (obj === Object(obj)) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = getRawObject(obj[key]);
      return acc;
    }, {});
  }
  // Return base case where obj could be anything else
  return obj;
}

const initialState = {};

// Compute new state based on action
function updateState(prevState, action) {
  // Peel away Structs and assign to State tree rooted at storeID
  let newState = {
    [action.storeID]: getRawObject(action.data)
  };
  // Clone everything
  return Object.assign({}, prevState, newState);
}

// Clones state from application stores and maps it into the OmniStore
module.exports = function (state = initialState, action) {
  // Return early if the action didn't come from the application dispatcher
  if (action.__origin !== APP_NAMESPACE) {
    return state;
  }

  switch (action.type) {
    case APP_STORE_CHANGE:
      return updateState(state, action);
    default:
      return state;
  }
};
