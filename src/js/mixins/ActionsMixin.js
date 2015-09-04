var _ = require("underscore");
var Actions = require("../actions/Actions");

var ActionsMixin = {

  componentDidMount: function () {
    // Actions disabled for component
    if (this.actions_configuration && this.actions_configuration.disable) {
      return;
    }

    this.actions_registerComponent();
    this.actions_monkeyPatch();
  },

  componentWillUnmount: function () {
    Actions.deregisterComponent(this.actions_componentID);
  },

  /**
   * Registers component instance in Actions singleton
   */
  actions_registerComponent: function () {
    this.actions_componentID = this._rootNodeID + "-" +
      this.constructor.displayName;

    Actions.registerComponent({
      id: this.actions_componentID,
      path: this._rootNodeID,
      componentName: this.constructor.displayName,
      instance: this
    });
  },

  /**
   * Replace `this.setState` with our proxy function
   * That way we can keep track of state changes
   */
  actions_monkeyPatch: function () {
    this.actions_setStateOriginal = this.setState;
    this.setState = this.actions_setStateProxy;
  },

  actions_setStateProxy: function (state) {
    // Get the diff as that's the only thing we want to log
    var stateDiff = _.reduce(state, function (memo, value, key) {
      if (key === "children") {
        return memo;
      }

      if (this[key] !== value) {
        memo[key] = value;
      }

      return memo;
    }, {}, this.state);

    this.actions_setStateOriginal.apply(this, arguments);

    this.actions_processState(stateDiff);
  },

  actions_getStateConfiguration: function () {
    if (this.actions_configuration && this.actions_configuration.state) {
      return this.actions_configuration.state;
    } else {
      return {};
    }
  },

  actions_getStateConfigurationForKey: function (key) {
    var configuration = this.actions_getStateConfiguration();
    return configuration[key];
  },

  actions_processState: function (stateOriginal) {
    var state = _.clone(stateOriginal);
    if (this.actions_configuration && this.actions_configuration.state) {
      state = _.omit(state, function (value, key) {
        var keyConfig = this.actions_configuration.state[key];
        if (keyConfig && keyConfig.skip) {
          return keyConfig.skip;
        } else {
          return false;
        }
      }, this);
    }

    // No actions to log :(
    if (Object.keys(state).length === 0) {
      return;
    }

    var messages = _.map(state, function (value, key) {
      var uiEventNames = [];
      var keyConfig = this.actions_getStateConfigurationForKey(key);

      // Build a unique ui event names
      uiEventNames.push(this.constructor.displayName, key);

      // Append custom ui event names if there's one
      if (keyConfig && typeof keyConfig === "function") {
        uiEventNames.push(keyConfig.call(this, value));
      }

      return uiEventNames;
    }, this);

    messages = _.values(messages);
    Actions.logBatchAction(messages, state, this.actions_componentID);
  }
};

module.exports = ActionsMixin;
