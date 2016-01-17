jest.dontMock('../../mixins/InternalStorageMixin');
jest.dontMock('../../mixins/TabsMixin');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../stores/ACLGroupStore');
jest.dontMock('../../stores/MesosSummaryStore');
jest.dontMock('../../stores/MarathonStore');
jest.dontMock('../../utils/MesosSummaryUtil');
jest.dontMock('../../events/MesosSummaryActions');
jest.dontMock('../../events/MarathonActions');
jest.dontMock('../SidePanelContents');
jest.dontMock('../GroupSidePanel');
jest.dontMock('../GroupSidePanelContents');
jest.dontMock('../../utils/Util');
jest.dontMock('../../utils/RequestUtil');
jest.dontMock('../../structs/SummaryList');

require('../../utils/StoreMixinConfig');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var MesosSummaryActions = require('../../events/MesosSummaryActions');
var ACLGroupStore = require('../../stores/ACLGroupStore');
var MesosSummaryStore = require('../../stores/MesosSummaryStore');
var GroupSidePanel = require('../GroupSidePanel');
var GroupSidePanelContents = require('../GroupSidePanelContents');

describe('GroupSidePanel', function () {
  beforeEach(function () {
    this.fetchSummary = MesosSummaryActions.fetchSummary;
    this.groupStore = ACLGroupStore.getGroup;

    MesosSummaryActions.fetchSummary = function () {
      return null;
    };

    MesosSummaryStore.get = function () {
      return true;
    };

    ACLGroupStore.getGroup = function () {
      return {
        'gid': 'group',
        'url': '/groups/group',
        'description': 'group description'
      };
    };

    MesosSummaryStore.init();
  });

  afterEach(function () {
    MesosSummaryActions.fetchSummary = this.fetchSummary;
    ACLGroupStore.getGroup = this.groupStore;
  });

  describe('#isOpen', function () {
    beforeEach(function () {
      this.params = {
        groupID: null
      };
      this.instance = TestUtils.renderIntoDocument(
        <GroupSidePanel
          params={this.params}
          openedPage="settings-organization-groups" />
      );
    });

    it('should return false if all IDs are null', function () {
      expect(this.instance.isOpen()).toEqual(false);
    });

    it('should return true if new groupID received', function () {
      var prevGroupID = this.params.groupID;
      this.params.groupID = 'groupname';
      expect(this.instance.isOpen()).toEqual(true);
      this.params.groupID = prevGroupID;
    });
  });

  describe('#getContents', function () {
    beforeEach(function () {
      this.params = {
        groupID: null
      };
      this.instance = TestUtils.renderIntoDocument(
        <GroupSidePanel
          statesProcessed={true}
          params={this.params} />
      );
    });

    it('should return GroupSidePanelContents if groupID is set',
      function () {
        this.params.groupID = 'set';
        var contents = this.instance.getContents(this.params.groupID);

        expect(contents.type === GroupSidePanelContents).toEqual(true);
        this.params.serviceName = null;
      }
    );

  });
});
