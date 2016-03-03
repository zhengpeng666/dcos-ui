var React = require('react');
var PluginSDK = require('PluginSDK');

function overrides() {
  var originalCreateClass = React.createClass;

  // Override React.createClass so that each component gets
  // the ActionsMixin
  React.createClass = function (specification) {
    if (specification.mixins == null) {
      specification.mixins = [];
    }
    var ActionsMixin = PluginSDK.getActions('tracking', {});
    // We don't want to log actions from the router
    if (specification.displayName !== 'Router') {
      specification.mixins.push(ActionsMixin);
    }

    return originalCreateClass.call(null, specification);
  };
}

module.exports.override = overrides;
