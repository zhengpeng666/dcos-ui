import _ from 'underscore';
// import {createStore} from 'redux';
import Events from 'events';

// let store;

// const createStore = function () {
//   return;
// };

const PluginBridge = _.extend({}, Events.EventEmitter.prototype, {

  reducers: [],

  replaceStoreReducers() {

  },

  loadPlugins() {

  }
});

export default PluginBridge;
