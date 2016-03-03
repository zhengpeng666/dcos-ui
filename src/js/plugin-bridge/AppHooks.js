import SidebarActions from '../events/SidebarActions';

module.exports = {
  actions: [
    'closeSidebar'
  ],

  initialize(SDK) {
    this.actions.forEach(function (action) {
      SDK.Hooks.addAction(action, this[action].bind(this));
    }, this);
  },

  closeSidebar() {
    SidebarActions.close();
  }
};
