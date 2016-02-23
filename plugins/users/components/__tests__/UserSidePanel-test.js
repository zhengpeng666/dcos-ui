jest.dontMock('../../../../src/js/mixins/InternalStorageMixin');
jest.dontMock('../../../../src/js/mixins/TabsMixin');
jest.dontMock('../../../../src/js/mixins/GetSetMixin');
jest.dontMock('../../../../src/js/components/SidePanelContents');
jest.dontMock('../UserSidePanel');
jest.dontMock('../UserSidePanelContents');

var JestUtil = require('../../../../src/js/utils/JestUtil');

JestUtil.unMockStores(['ACLUserStore', 'MesosSummaryStore', 'MarathonStore']);
require('../../../../src/js/utils/StoreMixinConfig');

var React = require('react');
var ReactDOM = require('react-dom');

var MesosSummaryActions = require('../../../../src/js/events/MesosSummaryActions');
var ACLUserStore = require('../../stores/ACLUserStore');
var MesosSummaryStore = require('../../../../src/js/stores/MesosSummaryStore');
var UserSidePanel = require('../UserSidePanel');
var UserSidePanelContents = require('../UserSidePanelContents');

describe('UserSidePanel', function () {
  beforeEach(function () {

    this.fetchSummary = MesosSummaryActions.fetchSummary;
    this.userStore = ACLUserStore.getUser;

    this.container = document.createElement('div');

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

    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#isOpen', function () {
    beforeEach(function () {
      this.params = {
        userID: null
      };
      this.instance = ReactDOM.render(
        <UserSidePanel
          params={this.params}
          openedPage="settings-organization-users" />,
        this.container
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
      this.instance = ReactDOM.render(
        <UserSidePanel
          statesProcessed={true}
          params={this.params} />,
        this.container
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
