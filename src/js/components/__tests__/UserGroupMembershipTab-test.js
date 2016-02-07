jest.dontMock('../UserGroupMembershipTab');
jest.dontMock('../UserGroupTable');
jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../../events/ACLUsersActions');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../stores/ACLGroupStore');
jest.dontMock('../../stores/ACLGroupsStore');
jest.dontMock('../../utils/ResourceTableUtil');
jest.dontMock('../../utils/StringUtil');
jest.dontMock('../../utils/Util');

require('../../utils/StoreMixinConfig');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

var ACLGroupStore = require('../../stores/ACLGroupStore');
var ACLGroupsStore = require('../../stores/ACLGroupsStore');
var ACLUserStore = require('../../stores/ACLUserStore');
var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../events/AppDispatcher');
var UserGroupMembershipTab = require('../UserGroupMembershipTab');
var User = require('../../structs/User');

let userDetailsFixture =
  require('../../../../tests/_fixtures/acl/user-with-details.json');
userDetailsFixture.groups = userDetailsFixture.groups.array;

describe('UserGroupMembershipTab', function () {

  beforeEach(function () {
    this.groupStoreAddUser = ACLGroupStore.addUser;
    this.groupsStoreGet = ACLGroupsStore.get;
    this.userStoreGetUser = ACLUserStore.getUser;

    ACLGroupsStore.get = function (key) {
      if (key === 'groups') {
        return {
          getItems: function () {
            return [
              {
                description: 'foo',
                gid: 'bar'
              },
              {
                description: 'bar',
                gid: 'baz'
              },
              {
                description: 'baz',
                gid: 'qux'
              }
            ];
          }
        };
      }
    };

    ACLGroupStore.addUser = jest.genMockFunction();

    ACLUserStore.getUser = function (userID) {
      if (userID === 'unicode') {
        return new User(userDetailsFixture);
      }
    };

    this.instance = TestUtils.renderIntoDocument(
      <UserGroupMembershipTab userID={'unicode'}/>
    );

    this.instance.setState({requestGroupsSuccess: true});
  });

  afterEach(function () {
    ACLGroupStore.addUser = this.groupStoreAddUser;
    ACLGroupsStore.get = this.groupsStoreGet;
    ACLUserStore.getUser = this.userStoreGetUser;
  });

  describe('add groups dropdown', function () {

    beforeEach(function () {
      this.instance.dropdownButton = TestUtils
        .scryRenderedDOMComponentsWithClass(this.instance, 'dropdown-toggle');
      TestUtils.Simulate.click(this.instance.dropdownButton[0].getDOMNode());

      this.instance.selectableElements = TestUtils
        .scryRenderedDOMComponentsWithClass(this.instance, 'is-selectable');
      TestUtils.Simulate.click(this.instance.selectableElements[1]
        .getDOMNode());
    });

    it('should call the handler when selecting a group', function () {
      expect(ACLGroupStore.addUser.mock.calls.length).toEqual(1);
    });

    it('should call #addUser with the proper arguments when selecting a group',
      function () {
      expect(ACLGroupStore.addUser.mock.calls[0][0]).toEqual('baz');
      expect(ACLGroupStore.addUser.mock.calls[0][1]).toEqual('unicode');
    });

  });

  describe('#onGroupsStoreError', function () {

    it('sets state in resposne to failure', function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_GROUPS_ERROR
      });
      expect(this.instance.state.requestGroupsError).toEqual(true);
      expect(this.instance.state.requestGroupsSuccess).toEqual(false);
    });

  });

  describe('#onGroupsStoreSuccess', function () {

    it('sets state in resposne to failure', function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_GROUPS_SUCCESS
      });
      expect(this.instance.state.requestGroupsError).toEqual(false);
      expect(this.instance.state.requestGroupsSuccess).toEqual(true);
    });

  });

  describe('#getDropdownItems', function () {

    it('returns an array of objects with the correct keys', function () {
      var items = this.instance.getDropdownItems();

      items.forEach(function (item) {
        expect(item.id).toNotEqual(null);
        expect(item.name).toNotEqual(null);
        expect(item.html).toNotEqual(null);
        expect(item.selectedHtml).toNotEqual(null);
      });
    });

    it('returns the default selected item first', function () {
      expect(this.instance.getDropdownItems()[0]).toEqual({
        id: 'default-placeholder-group-id',
        name: 'Add Group',
        html: 'Add Group',
        selectedHtml: 'Add Group'
      });
    });

    it('returns the correct number of items', function () {
      expect(this.instance.getDropdownItems().length).toEqual(4);
    });

  });

});
