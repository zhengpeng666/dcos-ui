import HistoryStore from '../stores/HistoryStore';
import SidebarActions from '../events/SidebarActions';

module.exports = {
  actions: [
    'closeSidebar',
    'goBack'
  ],

  initialize(SDK) {
    this.actions.forEach(action => {
      SDK.Hooks.addAction(action, this[action].bind(this));
    });
  },

  closeSidebar() {
    SidebarActions.close();
  },

  goBack(router) {
    HistoryStore.goBack(router);
  }
};
