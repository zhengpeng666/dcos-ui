jest.dontMock('../../mixins/InternalStorageMixin');
jest.dontMock('../../mixins/TabsMixin');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../SidePanelContents');
jest.dontMock('../GroupSidePanel');
jest.dontMock('../GroupSidePanelContents');
jest.dontMock('../../stores/ACLGroupStore');
jest.dontMock('../../stores/MesosSummaryStore');
jest.dontMock('../../stores/MarathonStore');

var JestUtil = require('../../utils/JestUtil');

JestUtil.unMockStores(['ACLGroupStore', 'MesosSummaryStore', 'MarathonStore']);
require('../../utils/StoreMixinConfig');

var React = require('react');
var ReactDOM = require('react-dom');

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
      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <GroupSidePanel
          params={this.params}
          openedPage="settings-organization-groups" />,
        this.container
      );
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
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
      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <GroupSidePanel
          statesProcessed={true}
          params={this.params} />,
        this.container
      );
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
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
