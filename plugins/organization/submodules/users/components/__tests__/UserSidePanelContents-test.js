jest.dontMock('../../../../../../src/js/components/SidePanelContents');
jest.dontMock('../UserSidePanelContents');
jest.dontMock('../../../../../../src/js/mixins/GetSetMixin');
jest.dontMock('../../../../../../src/js/mixins/InternalStorageMixin');
jest.dontMock('../../../../../../src/js/mixins/TabsMixin');
jest.dontMock('../../../../../../src/js/components/RequestErrorMsg');
jest.dontMock('../../../../../../src/js/stores/MesosSummaryStore');
jest.dontMock('../../stores/ACLUserStore');

require('../../../../../../src/js/utils/StoreMixinConfig');

var React = require('react');
var ReactDOM = require('react-dom');

var ACLUserStore = require('../../stores/ACLUserStore');
var MesosSummaryStore = require('../../../../../../src/js/stores/MesosSummaryStore');
var EventTypes = require('../../constants/EventTypes');
var UserSidePanelContents = require('../UserSidePanelContents');
var User = require('../../../../../../src/js/structs/User');

var userDetailsFixture =
  require('../../../../../../tests/_fixtures/acl/user-with-details.json');
userDetailsFixture.groups = userDetailsFixture.groups.array;

describe('UserSidePanelContents', function () {

  beforeEach(function () {
    this.summaryGet = MesosSummaryStore.get;
    this.userStoreGetUser = ACLUserStore.getUser;

    this.container = document.createElement('div');

    MesosSummaryStore.get = function (status) {
      if (status === 'statesProcessed') {
        return true;
      }
    };

    ACLUserStore.getUser = function (userID) {
      if (userID === 'unicode') {
        return new User(userDetailsFixture);
      }
    };
  });

  afterEach(function () {
    MesosSummaryStore.get = this.summaryGet;
    ACLUserStore.getUser = this.userStoreGetUser;

    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#render', function () {

    it('should return error message if fetch error was received', function () {
      var userID = 'unicode';

      var instance = ReactDOM.render(
        <UserSidePanelContents
          itemID={userID}/>,
        this.container
      );

      ACLUserStore.emit(EventTypes.ACL_USER_DETAILS_FETCHED_ERROR, userID);

      var node = ReactDOM.findDOMNode(instance);
      var text = node.querySelector('h3');

      expect(text.textContent)
        .toEqual('Cannot Connect With The Server');
    });

    it('should show loading screen if still waiting on Store', function () {
      MesosSummaryStore.get = function (status) {
        if (status === 'statesProcessed') {
          return false;
        }
      };
      var userID = 'unicode';

      var instance = ReactDOM.render(
        <UserSidePanelContents
          itemID={userID}/>,
        this.container
      );

      var node = ReactDOM.findDOMNode(instance);
      var loading = node.querySelector('.ball-scale');

      expect(loading).toNotBe(null);
    });

    it('should not return error message or loading screen if user is found',
      function () {
        var userID = 'unicode';

        var instance = ReactDOM.render(
          <UserSidePanelContents
            itemID={userID}/>,
          this.container
        );

        var node = ReactDOM.findDOMNode(instance);
        var text = node.querySelector('.form-element-inline-text');

        expect(text.textContent).toEqual('藍-Schüler Zimmer verfügt über einen Schreibtisch, Telefon, Safe in Notebook-Größe');
      }
    );

  });
});
