jest.dontMock('../../../../../../tests/_fixtures/acl/user-with-details.json');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

var _ = require('underscore');
var User = require('../User');
var userFixture = require('../../../../../../tests/_fixtures/acl/user-with-details.json');
userFixture.groups = userFixture.groups.array;

describe('User', function () {

  beforeEach(function () {
    require('../../../../SDK').setSDK(SDK);
    this.userFixture = _.clone(userFixture);
    this.instance = new User(userFixture);
  });

  describe('#getGroups', function () {

    // it('returns an instance of GroupsList', function () {
    //   var groups = this.instance.getGroups();
    //   expect(groups instanceof GroupsList).toBeTruthy();
    // });

    it('returns a GroupsList with the number of items we provided',
      function () {
      var groups = this.instance.getGroups().getItems();
      expect(groups.length)
        .toEqual(2);
    });

    it('returns a GroupsList with the data we provided', function () {
      var groups = this.instance.getGroups().getItems();
      expect(groups[0].get('gid'))
        .toEqual(this.userFixture.groups[0].group.gid);
      expect(groups[1].get('gid'))
        .toEqual(this.userFixture.groups[1].group.gid);
    });

  });

  describe('#getGroupCount', function () {

    it('returns the number of groups', function () {
      expect(this.instance.getGroupCount())
        .toEqual(2);
    });

  });

  describe('#getPermissions', function () {

    it('returns the permissions it was given', function () {
      expect(this.instance.getPermissions())
        .toEqual(this.userFixture.permissions);
    });

  });

  describe('#getPermissionCount', function () {

    it('returns the number of groups', function () {
      expect(this.instance.getPermissionCount()).toEqual(1);
    });

  });

  describe('#getUniquePermissions', function () {

    it('returns an array of services user has permission to', function () {
      var permissionList = this.instance.getUniquePermissions();

      expect(permissionList.length).toEqual(1);
      expect(permissionList[0].rid).toEqual('service.marathon');
    });

    it('returns empty array when user has no permissions', function () {
      var user = new User([]);
      var permissionList = user.getUniquePermissions();

      expect(permissionList).toEqual([]);
    });

    it('returns unique array when user has duplicate permissions', function () {
      const rawUser = {
        uid: 'person',
        permissions: {
          direct:
           [ { aclurl: 'service-1' },
             { aclurl: 'service-2' },
             { aclurl: 'service-3' } ],
          groups:
           [ { aclurl: 'service-2' } ]
        }
      };

      var user = new User(rawUser);
      var permissionList = user.getUniquePermissions();

      expect(permissionList.length).toEqual(3);
    });

  });

  describe('#isRemote', function () {

    it('returns if user is remote as a boolean', function () {
      var isRemote = this.instance.isRemote();
      expect(typeof isRemote).toEqual('boolean');
    });

    it('returns true if user is remote', function () {
      var user = new User({
        is_remote: true
      });

      expect(user.isRemote()).toEqual(true);
    });

  });

});
