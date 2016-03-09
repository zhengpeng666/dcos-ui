jest.dontMock('../../actions/ACLGroupsActions');
jest.dontMock('../ACLGroupStore');
jest.dontMock('../../../users/structs/User');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

let ACLGroupsActions = require('../../actions/ACLGroupsActions');
let ACLGroupStore = require('../ACLGroupStore');
let ActionTypes = require('../../constants/ActionTypes');
let EventTypes = require('../../constants/EventTypes');
let Group = require('../../structs/Group');
var OrganizationReducer = require('../../../../Reducer');

PluginTestUtils.addReducer('organization', OrganizationReducer);

describe('ACLGroupStore', function () {

  beforeEach(function () {
    let groups = {};
    let groupsFetching = {};

    SDK.dispatch({
      type: EventTypes.ACL_GROUP_SET_GROUPS,
      groups
    });
    SDK.dispatch({
      type: EventTypes.ACL_GROUP_SET_GROUPS_FETCHING,
      groupsFetching
    });
  });

  describe('#getGroupRaw', function () {

    it('returns the group that was set', function () {
      let groups = {foo: {bar: 'baz'}};
      SDK.dispatch({
        type: EventTypes.ACL_GROUP_SET_GROUPS,
        groups
      });
      expect(ACLGroupStore.getGroupRaw('foo')).toEqual({bar: 'baz'});
    });

  });

  describe('#getGroup', function () {

    it('returns an instance of Group', function () {
      let groups = {foo: {bar: 'baz'}};
      SDK.dispatch({
        type: EventTypes.ACL_GROUP_SET_GROUPS,
        groups
      });
      expect(ACLGroupStore.getGroup('foo') instanceof Group).toBeTruthy();
    });

    it('returns the correct group data', function () {
      let groups = {foo: {bar: 'baz'}};
      SDK.dispatch({
        type: EventTypes.ACL_GROUP_SET_GROUPS,
        groups
      });
      expect(ACLGroupStore.getGroup('foo').get()).toEqual({bar: 'baz'});
    });

  });

  describe('#setGroup', function () {

    it('sets group', function () {
      ACLGroupStore.setGroup('foo', {bar: 'baz'});
      expect(ACLGroupStore.get('groupDetail')).toEqual({foo: {bar: 'baz'}});
    });

  });

  describe('#fetchGroupWithDetails', function () {

    beforeEach(function () {
      spyOn(ACLGroupsActions, 'fetchGroup');
      spyOn(ACLGroupsActions, 'fetchGroupUsers');
      spyOn(ACLGroupsActions, 'fetchGroupPermissions');
    });

    it('tracks group as fetching', function () {
      ACLGroupStore.fetchGroupWithDetails('foo');
      expect(ACLGroupStore.get('groupsFetching')).toEqual({foo: {
        group: false, users: false, permissions: false
      }});
    });

    it('calls necessary APIs to fetch groups details', function () {
      ACLGroupStore.fetchGroupWithDetails('foo');
      expect(ACLGroupsActions.fetchGroup).toHaveBeenCalled();
      expect(ACLGroupsActions.fetchGroupUsers).toHaveBeenCalled();
      expect(ACLGroupsActions.fetchGroupPermissions).toHaveBeenCalled();
    });

  });

  describe('dispatcher', function () {

    afterEach(function () {
      ACLGroupStore.removeAllListeners();
    });

    describe('group', function () {

      it('stores group when event is dispatched', function () {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_SUCCESS,
          data: {gid: 'foo', bar: 'baz'}
        });

        expect(ACLGroupStore.getGroupRaw('foo'))
          .toEqual({gid: 'foo', bar: 'baz'});
      });

      it('emits event after success event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_DETAILS_GROUP_CHANGE,
          function (groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_SUCCESS,
          data: {gid: 'foo'}
        });
      });

      it('emits event after error event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_DETAILS_GROUP_ERROR,
          function (data, groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_ERROR,
          groupID: 'foo'
        });
      });

    });

    describe('users', function () {

      it('stores users when event is dispatched', function () {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_USERS_SUCCESS,
          data: {bar: 'baz'},
          groupID: 'foo'
        });

        expect(ACLGroupStore.getGroupRaw('foo'))
          .toEqual({users: {bar: 'baz'}});
      });

      it('emits event after success event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_DETAILS_GROUP_CHANGE,
          function (groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_USERS_SUCCESS,
          groupID: 'foo'
        });
      });

      it('emits event after error event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_DETAILS_USERS_ERROR,
          function (data, groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_USERS_ERROR,
          groupID: 'foo'
        });
      });

    });

    describe('permissions', function () {

      it('stores permissions when event is dispatched', function () {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS,
          data: {bar: 'baz'},
          groupID: 'foo'
        });

        expect(ACLGroupStore.getGroupRaw('foo'))
          .toEqual({permissions: {bar: 'baz'}});
      });

      it('emits event after success event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_DETAILS_PERMISSIONS_CHANGE,
          function (groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS,
          groupID: 'foo'
        });
      });

      it('emits event after error event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_DETAILS_PERMISSIONS_ERROR,
          function (data, groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_ERROR,
          groupID: 'foo',
          data: 'bar'
        });
      });

    });

    describe('create', function () {

      it('emits event after success event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_CREATE_SUCCESS,
          function () {
            expect(true).toEqual(true);
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_CREATE_SUCCESS
        });
      });

      it('emits success event with the groupID', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_CREATE_SUCCESS,
          function (groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_CREATE_SUCCESS,
          groupID: 'foo'
        });
      });

      it('emits event after error event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_CREATE_ERROR,
          function () {
            expect(true).toEqual(true);
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_CREATE_ERROR
        });
      });

      it('emits error event with the groupID', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_CREATE_ERROR,
          function (data, groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_CREATE_ERROR,
          groupID: 'foo',
          data: 'bar'
        });
      });

    });

    describe('update', function () {

      it('emits event after success event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_UPDATE_SUCCESS,
          function () {
            expect(true).toEqual(true);
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_UPDATE_SUCCESS
        });
      });

      it('emits success event with the groupID', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_UPDATE_SUCCESS,
          function (groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_UPDATE_SUCCESS,
          groupID: 'foo'
        });
      });

      it('emits event after error event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_UPDATE_ERROR,
          function () {
            expect(true).toEqual(true);
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_UPDATE_ERROR
        });
      });

      it('emits error event with the groupID', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_UPDATE_ERROR,
          function (data, groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_UPDATE_ERROR,
          groupID: 'foo',
          data: 'bar'
        });
      });

      it('emits error event with the groupID and error message', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_UPDATE_ERROR,
          function (error, groupID) {
            expect(groupID).toEqual('foo');
            expect(error).toEqual('bar');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_UPDATE_ERROR,
          groupID: 'foo',
          data: 'bar'
        });
      });

    });

    describe('delete', function () {

      it('emits event after success event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_DELETE_SUCCESS,
          function () {
            expect(true).toEqual(true);
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_DELETE_SUCCESS
        });
      });

      it('emits success event with the groupID', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_DELETE_SUCCESS,
          function (groupID) {
            expect(groupID).toEqual('foo');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_DELETE_SUCCESS,
          groupID: 'foo'
        });
      });

      it('emits event after error event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_DELETE_ERROR,
          function () {
            expect(true).toEqual(true);
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_DELETE_ERROR
        });
      });

      it('emits error event with the groupID and error', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_DELETE_ERROR,
          function (error, groupID) {
            expect(groupID).toEqual('foo');
            expect(error).toEqual('error');
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_DELETE_ERROR,
          groupID: 'foo',
          data: 'error'
        });
      });

    });

    describe('adding user', function () {

      it('emits event after success event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_USERS_CHANGED, function () {
            expect([].slice.call(arguments)).toEqual(['foo', 'bar']);
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_ADD_USER_SUCCESS,
          groupID: 'foo',
          userID: 'bar'
        });
      });

      it('emits event after error event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_ADD_USER_ERROR, function () {
            expect([].slice.call(arguments)).toEqual(['error', 'foo', 'bar']);
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_ADD_USER_ERROR,
          data: 'error',
          groupID: 'foo',
          userID: 'bar'
        });
      });

    });

    describe('remove user', function () {

      it('emits event after success event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_USERS_CHANGED, function () {
            expect([].slice.call(arguments)).toEqual(['foo', 'bar']);
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS,
          groupID: 'foo',
          userID: 'bar'
        });
      });

      it('emits event after error event is dispatched', function () {
        ACLGroupStore.addChangeListener(
          EventTypes.ACL_GROUP_REMOVE_USER_ERROR, function () {
            expect([].slice.call(arguments)).toEqual(['error', 'foo', 'bar']);
          }
        );

        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_ERROR,
          data: 'error',
          groupID: 'foo',
          userID: 'bar'
        });
      });

    });

  });

});
