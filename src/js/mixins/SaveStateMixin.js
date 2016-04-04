import UserSettingsStore from '../stores/UserSettingsStore';

const SAVED_STATE_KEY = 'savedStates';

const SaveStateMixin = {
  componentWillMount() {
    let key = this.saveState_key;
    if (!key) {
      return;
    }

    let savedStates = UserSettingsStore.getKey(SAVED_STATE_KEY);

    let savedState = savedStates[key];
    if (savedState == null) {
      return;
    }

    this.setState(savedState);
  },

  componentWillUnmount() {
    let {saveState_key, state} = this;
    let savedStates = UserSettingsStore.getKey(SAVED_STATE_KEY);
    savedStates[saveState_key] = state;

    UserSettingsStore.setKey(SAVED_STATE_KEY, savedStates);
  }
};

module.exports = SaveStateMixin;
