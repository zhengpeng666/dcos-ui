let states = {};
let SavedStateStore = {
  addState(key, state) {
    states[key] = state;
  },

  getState(key) {
    return states[key];
  }
};

module.exports = SavedStateStore;
