let savedStates = {};

let SaveStateMixin = {
  componentWillMount() {
    if (!this.savedState_key) {
      return;
    }

    let savedState = savedStates[this.savedState_key];
    if (savedState != null) {
      this.setState(savedState);
    }
  },

  componentWillUnmount() {
    if (!this.savedState_key) {
      return;
    }

    savedStates[this.savedState_key] = this.state;
  }
};

module.exports = SaveStateMixin;
