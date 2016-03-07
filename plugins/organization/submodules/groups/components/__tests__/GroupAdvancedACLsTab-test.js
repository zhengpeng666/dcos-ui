jest.dontMock('../GroupAdvancedACLsTab');
jest.dontMock('../../stores/ACLGroupStore');
jest.dontMock('../../../../storeConfig');
jest.dontMock('../../../../../../tests/_fixtures/acl/group-with-details.json');

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

var ACLGroupStore = require('../../stores/ACLGroupStore');
var Group = require('../../structs/Group');
var GroupAdvancedACLsTab = require('../GroupAdvancedACLsTab');

let groupDetailsFixture =
  require('../../../../../../tests/_fixtures/acl/group-with-details.json');
groupDetailsFixture.permissions = groupDetailsFixture.permissions.array;

describe('GroupAdvancedACLsTab', function () {

  beforeEach(function () {
    this.groupStoreGetGroup = ACLGroupStore.getGroup;
    ACLGroupStore.getGroup = function (groupID) {
      if (groupID === 'unicode') {
        return new Group(groupDetailsFixture);
      }
    };

    this.container = document.createElement('div');
    this.instance = ReactDOM.render(
      <GroupAdvancedACLsTab itemID={'unicode'}/>,
      this.container
    );
  });

  afterEach(function () {
    ACLGroupStore.getGroup = this.groupStoreGetGroup;
    ReactDOM.unmountComponentAtNode(this.container);

  });

  describe('#getACLs', function () {

    it('returns empty array', function () {
      ACLGroupStore.getGroup = function () {
        return new Group({});
      };
      expect(this.instance.getACLs()).toEqual([]);
    });

    it('returns acls correctly', function () {
      expect(this.instance.getACLs()).toEqual([
        {rid: 'service.marathon', actions: ['access'], removable: true}
      ]);
    });

  });

});
