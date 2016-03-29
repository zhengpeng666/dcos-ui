import UserSettingsStore from '../stores/UserSettingsStore';

let SaveStateMixin = {
  componentWillMount() {
    if (!this.savedState_key) {
      return;
    }

    let savedState = UserSettingsStore.getSavedState(this.savedState_key);
    if (savedState != null) {
      this.setState(savedState);
    }
  },

  componentWillUnmount() {
    if (!this.savedState_key) {
      return;
    }

    UserSettingsStore.setSavedState(this.savedState_key, this.state);
  }
};

module.exports = SaveStateMixin;
