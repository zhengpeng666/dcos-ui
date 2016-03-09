jest.dontMock('../PermissionsTable');
jest.dontMock('../../stores/ACLStore');
jest.dontMock('../../../../storeConfig');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

var ReactComponents = require('reactjs-components');
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

// Need to mock Table
ReactComponents.Table = React.createClass({
  displayName: 'foo', render: function () { return null; }
});

import {
  REQUEST_ACL_USER_REVOKE_ACTION_ERROR,
  REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS
} from '../../constants/ActionTypes';

var User = require('../../../users/structs/User');
var ACLStore = require('../../stores/ACLStore');
var PermissionsTable = require('../PermissionsTable');

require('../../../../storeConfig').register();

const userDetailsFixture =
  require('../../../../../../tests/_fixtures/acl/user-with-details.json');

describe('PermissionsTable', function () {

  beforeEach(function () {
    this.container = document.createElement('div');
    this.instance = ReactDOM.render(
      <PermissionsTable
        permissions={(new User(userDetailsFixture)).getUniquePermissions()}
        itemType="user"
        itemID={userDetailsFixture.uid} />,
      this.container
    );

    this.instance.handleOpenConfirm = jest.genMockFunction();
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#onAclStoreUserRevokeError', function () {

    it('updates state when an error event is emitted', function () {
      SDK.dispatch({
        type: REQUEST_ACL_USER_REVOKE_ACTION_ERROR,
        data: 'foo bar',
        groupID: 'baz',
        userID: 'unicode'
      });

      expect(this.instance.state.permissionUpdateError).toEqual('foo bar');
      expect(this.instance.state.pendingRequest).toEqual(false);
    });

  });

  describe('#onAclStoreUserRevokeSuccess', function () {
    it('gets called when a success event is emitted', function () {
      this.instance.onAclStoreUserRevokeSuccess = jest.genMockFunction();

      SDK.dispatch({
        type: REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
        data: 'foo bar',
        groupID: 'baz',
        userID: 'unicode'
      });

      expect(this.instance.onAclStoreUserRevokeSuccess.mock.calls.length)
        .toEqual(1);
    });

  });

  describe('#getConfirmModalContent', function () {

    beforeEach(function () {
      this.instance.state.permissionID = 'service.marathon';
      this.container = document.createElement('div');
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('returns a message containing the group\'s name and user\'s name',
      function () {
      var modalContent = this.instance.getConfirmModalContent(
        [{rid: 'service.marathon', description: 'Marathon'}]
      );

      var instance = ReactDOM.render(modalContent, this.container);
      var node = ReactDOM.findDOMNode(instance);
      var paragraphs = node.querySelector('p');

      expect(paragraphs.textContent)
        .toEqual('Permission to Marathon will be removed.');
    });

    it('returns a message containing the error that was received',
      function () {
      this.instance.state.permissionUpdateError = 'quux';
      var modalContent = this.instance.getConfirmModalContent(
        [{rid: 'service.marathon', description: 'Marathon'}]
      );
      var instance = ReactDOM.render(modalContent, this.container);
      var node = ReactDOM.findDOMNode(instance);
      var paragraphs = node.querySelectorAll('p');

      expect(paragraphs[1].textContent)
        .toEqual('quux');
    });

  });

  describe('#renderPermissionLabel', function () {

    it('returns the specified property from the object', function () {
      var label = this.instance.renderPermissionLabel('foo', {foo: 'bar'});
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

  describe('#handleButtonConfirm', function () {
    beforeEach(function () {
      ACLStore.revokeUserActionToResource = jest.genMockFunction();
      ACLStore.revokeGroupActionToResource = jest.genMockFunction();
    });

    it('calls revokeUser if itemType is user', function () {
      var instance = ReactDOM.render(
        <PermissionsTable
          permissions={(new User(userDetailsFixture)).getUniquePermissions()}
          itemType="user"
          itemID={userDetailsFixture.uid} />,
        this.container
      );
      instance.handleButtonConfirm();

      expect(ACLStore.revokeUserActionToResource.mock.calls.length).toEqual(1);
    });

    it('calls revokeGroup if itemType is group', function () {
      var instance = ReactDOM.render(
        <PermissionsTable
          permissions={(new User(userDetailsFixture)).getUniquePermissions()}
          itemType="group"
          itemID={userDetailsFixture.uid} />,
        this.container
      );
      instance.handleButtonConfirm();

      expect(ACLStore.revokeGroupActionToResource.mock.calls.length).toEqual(1);
    });
  });
});
