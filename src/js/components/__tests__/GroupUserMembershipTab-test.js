jest.dontMock('../GroupUserMembershipTab');
jest.dontMock('../GroupUserTable');
jest.dontMock('../../stores/ACLGroupStore');
jest.dontMock('../../stores/ACLGroupsStore');
jest.dontMock('../../stores/ACLUsersStore');

var JestUtil = require('../../utils/JestUtil');

JestUtil.unMockStores(['ACLGroupStore', 'ACLGroupsStore', 'ACLUsersStore']);
require('../../utils/StoreMixinConfig');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var ACLGroupStore = require('../../stores/ACLGroupStore');
var ACLGroupsStore = require('../../stores/ACLGroupsStore');
var ACLUsersStore = require('../../stores/ACLUsersStore');
var GroupUserMembershipTab = require('../GroupUserMembershipTab');
var Group = require('../../structs/Group');

const groupDetailsFixture =
  require('../../../../tests/_fixtures/acl/group-with-details.json');
groupDetailsFixture.permissions = groupDetailsFixture.permissions.array;
groupDetailsFixture.users = groupDetailsFixture.users.array;

describe('GroupUserMembershipTab', function () {

  beforeEach(function () {
    this.groupStoreGetGroup = ACLGroupStore.getGroup;

    ACLGroupStore.getGroup = function (groupID) {
      if (groupID === 'unicode') {
        return new Group(groupDetailsFixture);
      }
    };
    this.container = document.createElement('div');
    this.instance = ReactDOM.render(
      <GroupUserMembershipTab groupID={'unicode'}/>,
      this.container
    );

    this.instance.handleOpenConfirm = jest.genMockFunction();
  });

  afterEach(function () {
    ACLGroupStore.getGroup = this.groupStoreGetGroup;

    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('add users dropdown', function () {

    beforeEach(function () {
      this.usersStoreGet = ACLUsersStore.get;
      this.groupStoreAddUser = ACLGroupStore.addUser;

      ACLGroupStore.addUser = jest.genMockFunction();
      ACLUsersStore.get = function (key) {
        if (key === 'users') {
          return {
            getItems: function () {
              return [
                {
                  description: 'foo',
                  uid: 'bar'
                },
                {
                  description: 'bar',
                  uid: 'baz'
                },
                {
                  description: 'baz',
                  uid: 'qux'
                }
              ];
            }
          };
        }
      };

      this.instance.setState({requestUsersSuccess: true});

      var node = ReactDOM.findDOMNode(this.instance);

      var dropdownButton = node.querySelector('.dropdown-toggle');
      TestUtils.Simulate.click(dropdownButton);

      var selectableElements = node.querySelectorAll('.is-selectable')[1];
      TestUtils.Simulate.click(selectableElements);
    });

    afterEach(function () {
      ACLGroupsStore.get = this.usersStoreGet;
      ACLGroupStore.addUser = this.groupStoreAddUser;
    });

    it('should call the handler when selecting a user', function () {
      expect(ACLGroupStore.addUser.mock.calls.length).toEqual(1);
    });

    it('should call #addUser with the proper arguments when selecting a user',
      function () {
      expect(ACLGroupStore.addUser.mock.calls[0][0]).toEqual('unicode');
      expect(ACLGroupStore.addUser.mock.calls[0][1]).toEqual('baz');
    });

  });

});
