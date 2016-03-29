import UserSettingsStore from '../stores/UserSettingsStore';

let SaveStateUtil = {
  getSavedState(component) {
    if (!component.savedState_key) {
      return;
    }

    let savedState = UserSettingsStore.getSavedState(component.savedState_key);
    if (savedState != null) {
      component.setState(savedState);
    }
  },

  setSavedState(component) {
    if (!component.savedState_key) {
      return;
    }

    UserSettingsStore.setSavedState(component.savedState_key, component.state);
  }
};

module.exports = SaveStateUtil;
