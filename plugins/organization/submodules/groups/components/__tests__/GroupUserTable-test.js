jest.dontMock('../GroupUserTable');
jest.dontMock('../../stores/ACLGroupStore');
jest.dontMock('../../../../storeConfig');

import PluginTestUtils from 'PluginTestUtils';

/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

let SDK = PluginTestUtils.getSDK('Organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);
require('../../../../storeConfig').register();

var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var ActionTypes = require('../../constants/ActionTypes');
var ACLGroupStore = require('../../stores/ACLGroupStore');
var GroupUserTable = require('../GroupUserTable');

var AppDispatcher = require('../../../../../../src/js/events/AppDispatcher');
var Group = require('../../../../../../src/js/structs/Group');

const groupDetailsFixture =
  require('../../../../../../tests/_fixtures/acl/group-with-details.json');
groupDetailsFixture.permissions = groupDetailsFixture.permissions.array;
groupDetailsFixture.users = groupDetailsFixture.users.array;

describe('GroupUserTable', function () {

  beforeEach(function () {
    this.groupStoreGetGroup = ACLGroupStore.getGroup;

    ACLGroupStore.getGroup = function (groupID) {
      if (groupID === 'unicode') {
        return new Group(groupDetailsFixture);
      }
    };
    this.container = document.createElement('div');
    this.instance = ReactDOM.render(
      <GroupUserTable groupID={'unicode'}/>,
      this.container
    );

    this.instance.handleOpenConfirm = jest.genMockFunction();
  });

  afterEach(function () {
    ACLGroupStore.removeAllListeners();
    ACLGroupStore.getGroup = this.groupStoreGetGroup;

    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#onGroupStoreDeleteUserError', function () {

    it('updates state when an error event is emitted', function () {
      ACLGroupStore.deleteUser = function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_ERROR,
          data: 'foo bar',
          groupID: 'baz',
          userID: 'unicode'
        });
      };

      ACLGroupStore.deleteUser('foo', 'unicode');
      expect(this.instance.state.groupUpdateError).toEqual('foo bar');
    });

  });

  describe('#onGroupStoreDeleteUserSuccess', function () {

    it('gets called when a success event is emitted', function () {
      ACLGroupStore.deleteUser = function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS,
          data: 'foo bar',
          groupID: 'baz',
          userID: 'unicode'
        });
      };
      this.instance.onGroupStoreDeleteUserSuccess = jest.genMockFunction();

      ACLGroupStore.deleteUser('foo', 'unicode');
      expect(this.instance.onGroupStoreDeleteUserSuccess.mock.calls.length)
        .toEqual(1);
    });

  });

  describe('#getConfirmModalContent', function () {

    beforeEach(function () {
      this.instance.state.userID = 'bar';
    });

    it('returns a message containing the group\'s name and user\'s name',
      function () {

        var modalContent = this.instance.getConfirmModalContent({
          description: 'foo', users: [{user: {uid: 'bar', description: 'qux'}}]
        });

        var component = ReactDOM.render(modalContent, this.container);
        var node = ReactDOM.findDOMNode(component);

        var paragraphs = node.querySelectorAll('p');

        expect(paragraphs[0].textContent)
          .toEqual('qux will be removed from the foo group.');
      });

    it('returns a message containing the error that was received',
      function () {

        this.instance.state.groupUpdateError = 'quux';

        var modalContent = this.instance.getConfirmModalContent({
          description: 'foo', users: [{user: {uid: 'bar', description: 'qux'}}]
        });

        var component = ReactDOM.render(modalContent, this.container);
        var node = ReactDOM.findDOMNode(component);

        var paragraphs = node.querySelectorAll('p');

        expect(paragraphs[1].textContent)
          .toEqual('quux');
      });

  });

  describe('#renderUserLabel', function () {

    it('returns the specified property from the object', function () {
      var label = this.instance.renderUserLabel('foo', {foo: 'bar'});
      expect(label).toEqual('bar');
    });

  });

  describe('#renderButton', function () {

    it('calls handleOpenConfirm with the proper arguments', function () {
      var buttonWrapper = ReactDOM.render(
        this.instance.renderButton('foo', {uid: 'bar'}),
        this.container
      );
      var node = ReactDOM.findDOMNode(buttonWrapper);
      var button = node.querySelector('button');

      TestUtils.Simulate.click(button);

      expect(this.instance.handleOpenConfirm.mock.calls[0][0]).toEqual(
        {uid: 'bar'}
      );
    });

  });

});
