const TestUtils = require('react-addons-test-utils');

let stores = {
  ACLAuthStore: '../../../plugins/auth/stores/ACLAuthStore',
  ACLDirectoriesStore: '../../../plugins/organization/submodules/directories/stores/ACLDirectoriesStore',
  ACLGroupsStore: '../../../plugins/organization/submodules/groups/stores/ACLGroupsStore',
  ACLGroupStore: '../../../plugins/organization/submodules/groups/stores/ACLGroupStore',
  ACLStore: '../../../plugins/auth/submodules/acl/stores/ACLStore',
  ACLUsersStore: '../../../plugins/organization/submodules/users/stores/ACLUsersStore',
  ACLUserStore: '../../../plugins/organization/submodules/users/stores/ACLUserStore',

  CosmosPackagesStore: '../stores/CosmosPackagesStore',
  MarathonStore: '../stores/MarathonStore',
  MesosLogStore: '../stores/MesosLogStore',
  MesosStateStore: '../stores/MesosStateStore',
  MesosSummaryStore: '../stores/MesosSummaryStore',
  MetadataStore: '../stores/MetadataStore',
  TaskDirectoryStore: '../stores/TaskDirectoryStore'
};

const JestUtil = {
  renderAndFindTag: function (instance, tag) {
    var result = TestUtils.renderIntoDocument(instance);
    return TestUtils.findRenderedDOMComponentWithTag(result, tag);
  },

  unMockStores: function (storeIDs) {
    Object.keys(stores).forEach(function (storeID) {
      if (storeIDs.indexOf(storeID) === -1) {
        jest.setMock(stores[storeID], {});
      }
    });
  },

  dontMockStore: function (storeID) {
    if (storeID in stores) {
      jest.dontMock(stores[storeID]);
      return true;
    }
  }
};

module.exports = JestUtil;
