// Cannot import here because of Circular reference.
// PluginSDK imports this module, which imports HistoryStore
// and HistoryStore imports PluginSDK via GetSetMixin.
let HistoryStore;
let SidebarActions;

module.exports = {
  actions: [
    'closeSidebar',
    'goBack'
  ],

  filters: [
    'getHistoryAt'
  ],

  initialize(SDK) {
    HistoryStore = require('../stores/HistoryStore');
    SidebarActions = require('../events/SidebarActions');

    this.actions.forEach(action => {
      SDK.Hooks.addAction(action, this[action].bind(this));
    });
    this.filters.forEach(filter => {
      SDK.Hooks.addFilter(filter, this[filter].bind(this));
    });
  },

  closeSidebar() {
    SidebarActions.close();
  },

  goBack(router) {
    HistoryStore.goBack(router);
  },

  getHistoryAt(index) {
    return HistoryStore.getHistoryAt(index);
  }
};
