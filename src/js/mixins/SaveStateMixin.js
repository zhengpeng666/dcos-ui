import SaveStateUtil from '../utils/SaveStateUtil';
import UserSettingsStore from '../stores/UserSettingsStore';

const SAVED_STATE_KEY = 'savedStates';

const SaveStateMixin = {
  componentWillMount() {
    let key = this.saveState_key;
    if (!key) {
      return;
    }

    let savedStates = UserSettingsStore.getKey(SAVED_STATE_KEY);
    let savedState = SaveStateUtil.getSavedState(key, savedStates);
    this.setState(savedState);
  },

  componentWillUnmount() {
    let {saveState_key, state} = this;
    let savedStates = UserSettingsStore.getKey(SAVED_STATE_KEY);
    let statesToSave = SaveStateUtil.setSavedState(
      saveState_key, state, savedStates
    );

    UserSettingsStore.setKey(SAVED_STATE_KEY, statesToSave);
  }
};

module.exports = SaveStateMixin;
