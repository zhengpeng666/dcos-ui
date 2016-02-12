jest.dontMock('../../mixins/InternalStorageMixin');
jest.dontMock('../../mixins/TabsMixin');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../stores/ACLUserStore');
jest.dontMock('../../stores/MesosSummaryStore');
jest.dontMock('../../stores/MarathonStore');
jest.dontMock('../../utils/MesosSummaryUtil');
jest.dontMock('../../events/MesosSummaryActions');
jest.dontMock('../../events/MarathonActions');
jest.dontMock('../SidePanelContents');
jest.dontMock('../UserSidePanel');
jest.dontMock('../UserSidePanelContents');
jest.dontMock('../../utils/Util');
jest.dontMock('../../utils/RequestUtil');
jest.dontMock('../../structs/SummaryList');

require('../../utils/StoreMixinConfig');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

var MesosSummaryActions = require('../../events/MesosSummaryActions');
var ACLUserStore = require('../../stores/ACLUserStore');
var MesosSummaryStore = require('../../stores/MesosSummaryStore');
var UserSidePanel = require('../UserSidePanel');
var UserSidePanelContents = require('../UserSidePanelContents');

MesosSummaryStore.setMaxListeners(100);
ACLUserStore.setMaxListeners(100);

describe('UserSidePanel', function () {
  beforeEach(function () {
    this.fetchSummary = MesosSummaryActions.fetchSummary;
    this.userStore = ACLUserStore.getUser;

    MesosSummaryActions.fetchSummary = function () {
      return null;
    };

    MesosSummaryStore.get = function () {
      return true;
    };

    ACLUserStore.getUser = function () {
      return {
        'uid': 'user',
        'url': '/users/user',
        'description': 'user description'
      };
    };

    MesosSummaryStore.init();
  });

  afterEach(function () {
    MesosSummaryActions.fetchSummary = this.fetchSummary;
    ACLUserStore.getUser = this.userStore;
  });

  describe('#isOpen', function () {
    beforeEach(function () {
      this.params = {
        userID: null
      };
      this.instance = TestUtils.renderIntoDocument(
        <UserSidePanel
          params={this.params}
          openedPage="settings-organization-users" />
      );
    });

    it('should return false if all IDs are null', function () {
      expect(this.instance.isOpen()).toEqual(false);
    });

    it('should return true if new userID received', function () {
      var prevUserID = this.params.userID;
      this.params.userID = 'username';
      expect(this.instance.isOpen()).toEqual(true);
      this.params.userID = prevUserID;
    });
  });

  describe('#getContents', function () {
    beforeEach(function () {
      this.params = {
        userID: null
      };
      this.instance = TestUtils.renderIntoDocument(
        <UserSidePanel
          statesProcessed={true}
          params={this.params} />
      );
    });

    it('should return UserSidePanelContents if userID is set',
      function () {
        this.params.userID = 'set';
        var contents = this.instance.getContents(this.params.userID);

        expect(contents.type === UserSidePanelContents).toEqual(true);
        this.params.serviceName = null;
      }
    );

  });
});
