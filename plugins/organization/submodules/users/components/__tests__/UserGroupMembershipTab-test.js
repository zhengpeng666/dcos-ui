jest.dontMock('../UserGroupMembershipTab');
jest.dontMock('../UserGroupTable');
jest.dontMock('../../../groups/stores/ACLGroupsStore');
jest.dontMock('../../../groups/stores/ACLGroupStore');
jest.dontMock('../../stores/ACLUserStore');
jest.dontMock('../../../../storeConfig');

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock('RequestUtil');

/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

require('../../../../storeConfig').register();

var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var ACLGroupStore = require('../../../groups/stores/ACLGroupStore');
var ACLGroupsStore = require('../../../groups/stores/ACLGroupsStore');
var ACLUserStore = require('../../stores/ACLUserStore');
var UserGroupMembershipTab = require('../UserGroupMembershipTab');

import {
  REQUEST_ACL_GROUPS_ERROR,
  REQUEST_ACL_GROUPS_SUCCESS
} from '../../../groups/constants/ActionTypes';

var AppDispatcher = require('../../../../../../src/js/events/AppDispatcher');
var User = require('../../structs/User');

let userDetailsFixture =
  require('../../../../../../tests/_fixtures/acl/user-with-details.json');
userDetailsFixture.groups = userDetailsFixture.groups.array;

describe('UserGroupMembershipTab', function () {

  beforeEach(function () {
    this.groupStoreAddUser = ACLGroupStore.addUser;
    this.groupsStoreGet = ACLGroupsStore.get;
    this.userStoreGetUser = ACLUserStore.getUser;
    this.container = document.createElement('div');
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

    this.instance = ReactDOM.render(
      <UserGroupMembershipTab userID={'unicode'}/>,
      this.container
    );

    this.instance.setState({requestGroupsSuccess: true});
  });

  afterEach(function () {
    ACLGroupStore.addUser = this.groupStoreAddUser;
    ACLGroupsStore.get = this.groupsStoreGet;
    ACLUserStore.getUser = this.userStoreGetUser;
    ReactDOM.unmountComponentAtNode(this.container);

  });

  describe('add groups dropdown', function () {

    beforeEach(function () {
      this.instance.dropdownButton = TestUtils
        .scryRenderedDOMComponentsWithClass(this.instance, 'dropdown-toggle');
      TestUtils.Simulate.click(ReactDOM.findDOMNode(this.instance.dropdownButton[0]));

      this.instance.selectableElements = TestUtils
        .scryRenderedDOMComponentsWithClass(this.instance, 'is-selectable');
      TestUtils.Simulate.click(ReactDOM.findDOMNode(this.instance.selectableElements[1]));
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

    it('sets state in response to failure', function () {
      AppDispatcher.handleServerAction({
        type: REQUEST_ACL_GROUPS_ERROR
      });
      expect(this.instance.state.requestGroupsError).toEqual(true);
      expect(this.instance.state.requestGroupsSuccess).toEqual(false);
    });

  });

  describe('#onGroupsStoreSuccess', function () {

    it('sets state in resposne to failure', function () {
      AppDispatcher.handleServerAction({
        type: REQUEST_ACL_GROUPS_SUCCESS
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
        className: 'hidden',
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
