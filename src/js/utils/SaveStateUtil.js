
let SaveStateUtil = {
  getSavedState(key, savedStates) {
    let savedState = savedStates[key];
    if (savedState == null) {
      return {};
    }

    return savedState;
  },

  setSavedState(key, state, savedStates) {
    savedStates[key] = state;
    return savedStates;
  }
};

module.exports = SaveStateUtil;
