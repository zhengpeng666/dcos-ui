import SavedStateStore from '../stores/SavedStateStore';

let SaveStateMixin = {
  componentWillMount() {
    if (!this.savedState_key) {
      return;
    }

    let savedState = SavedStateStore.getState(this.savedState_key);
    if (savedState != null) {
      this.setState(savedState);
    }
  },

  componentWillUnmount() {
    if (!this.savedState_key) {
      return;
    }

    SavedStateStore.addState(this.savedState_key, this.state);
  }
};

module.exports = SaveStateMixin;
