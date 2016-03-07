jest.dontMock('../UserAdvancedACLsTab');
jest.dontMock('../../stores/ACLUserStore');
jest.dontMock('../../../../storeConfig');
jest.dontMock('../../../../../../tests/_fixtures/acl/user-with-details.json');

/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

import PluginTestUtils from 'PluginTestUtils';

import {
  REQUEST_ACL_GROUPS_ERROR,
  REQUEST_ACL_GROUPS_SUCCESS
} from '../../../groups/constants/ActionTypes';

PluginTestUtils.dontMock('RequestUtil');
let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);
require('../../../../storeConfig').register();

var ACLUserStore = require('../../stores/ACLUserStore');
var User = require('../../structs/User');
var UserAdvancedACLsTab = require('../UserAdvancedACLsTab');

let userDetailsFixture =
  require('../../../../../../tests/_fixtures/acl/user-with-details.json');
userDetailsFixture.groups = userDetailsFixture.groups.array;

describe('UserAdvancedACLsTab', function () {

  beforeEach(function () {
    this.userStoreGetUser = ACLUserStore.getUser;
    ACLUserStore.getUser = function (userID) {
      if (userID === 'unicode') {
        return new User(userDetailsFixture);
      }
    };

    this.container = document.createElement('div');
    this.instance = ReactDOM.render(
      <UserAdvancedACLsTab itemID={'unicode'}/>,
      this.container
    );
  });

  afterEach(function () {
    ACLUserStore.getUser = this.userStoreGetUser;
    ReactDOM.unmountComponentAtNode(this.container);

  });

  describe('#getACLs', function () {

    it('returns empty array', function () {
      ACLUserStore.getUser = function () {
        return new User({});
      };
      expect(this.instance.getACLs()).toEqual([]);
    });

    it('returns acls correctly', function () {
      expect(this.instance.getACLs()).toEqual([
        {rid: 'service.marathon', actions: ['access'], removable: true},
        {rid: 'service.marathon', actions: ['access'], removable: false}
      ]);
    });

  });

});
