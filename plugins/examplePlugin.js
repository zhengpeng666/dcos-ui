const EXAMPLE = 'EXAMPLE';
const initialPluginState = {
  countSoFar: 0
};

const performComplexMath = function (Store, prevState, action, factor) {
  let newState = {};
  // Can access entire state tree (e.g. services etc)
  // let globalState = Store.getState();
  //
  // Lets just do some addition and multiply by our options parameter
  newState.countSoFar = prevState.countSoFar + (action.payload * factor);
  // Don't mutate state - return new state
  return Object.assign({}, prevState, newState);
};

/**
 * Function invoked by Plugin Bridge when loading plugins
 * @param {Store} Store               OmniStore
 * @param {Function} dispatch         Personalized dispatch with injected {__origin: name}
 * @param {String} name               Plugin name
 * @param {Object} options            Options as specified in config
 * @return {Function} [optional]      RootReducer for handling Plugin's Store state
 */
module.exports = function (Store, dispatch, name, options) {

  setInterval(function () {
    dispatch({
      type: EXAMPLE,
      payload: 1
    });
  }, 1000);

  function RootReducer(state = initialPluginState, action) {
    // Prevent all other plugins from calling my actions and altering my state.
    // Example for not doing this might be in an analytics plugin that want's to
    // track the number of times an action occurs.
    if (action.__origin !== name) {
      return state;
    }

    switch (action.type) {
      case EXAMPLE:
        return performComplexMath(Store, ...arguments, options.multiplier);
      default:
        return state;
    }
  }

  return RootReducer;
};

