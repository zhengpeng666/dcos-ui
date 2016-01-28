jest.dontMock('../ACLStore');
jest.dontMock('../../config/Config');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/ACLGroupsActions');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../structs/Item');
jest.dontMock('../../structs/ACLList');
jest.dontMock('../../structs/Item');
jest.dontMock('../../structs/List');
jest.dontMock('../../utils/RequestUtil');
jest.dontMock('../../utils/Util');
jest.dontMock('../../../../tests/_fixtures/acl/acls-unicode.json');

var _ = require('underscore');

var ACLList = require('../../structs/ACLList');
var ACLStore = require('../ACLStore');
var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../events/AppDispatcher');
var EventTypes = require('../../constants/EventTypes');
var RequestUtil = require('../../utils/RequestUtil');

var aclsFixture = require('../../../../tests/_fixtures/acl/acls-unicode.json');

describe('ACLStore', function () {

  describe('#fetchACLsForResource', function () {

    beforeEach(function () {
      this.requestFn = RequestUtil.json;
      RequestUtil.json = function (handlers) {
        handlers.success(aclsFixture);
      };
      this.aclsFixture = _.clone(aclsFixture);
    });

    afterEach(function () {
      RequestUtil.json = this.requestFn;
    });

    it('should return an instance of ACLList', function () {
      ACLStore.fetchACLsForResource('service');
      var services = ACLStore.get('services');
      expect(services instanceof ACLList).toBeTruthy();
    });

    it('should return all of the services it was given', function () {
      ACLStore.fetchACLsForResource('service');
      var services = ACLStore.get('services').getItems();
      expect(services.length).toEqual(this.aclsFixture.array.length);
    });

  });

  describe('dispatcher', function () {

    describe('ACLs', function () {

      it('stores services when event is dispatched', function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
          data: [{rid: 'foo', bar: 'baz'}],
          resourceType: 'service'
        });

        var services = ACLStore.get('services').getItems();
        expect(services[0].get('rid')).toEqual('foo');
        expect(services[0].get('bar')).toEqual('baz');
      });

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_RESOURCE_ACLS_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
          data: [{rid: 'foo', bar: 'baz'}],
          resourceType: 'service'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_RESOURCE_ACLS_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_ERROR,
          data: 'foo',
          resourceType: 'service'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

    });

    describe('ACL create', function () {
      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_CREATE_SUCCESS,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_CREATE_SUCCESS,
          resourceID: 'some.resource'
        });

        expect(mockedFn.mock.calls[0]).toEqual([
          'some.resource'
        ]);
      });
      it('dispatches the correct event upon error', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_CREATE_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_CREATE_ERROR,
          resourceID: 'some.resource'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });
    });

    describe('Grant Safe User action', function () {

      ACLStore.createACLForResource = jest.genMockFunction();
      const mockData = {
        ID: 'myname',
        action: 'access',
        resourceID: 'crazyname'
      };
      const ID = 'service.' + mockData.resourceID;

      it('first creates ACL for resource if nonexistent', function () {
        ACLStore.grantUserActionToResource(
          mockData.ID,
          mockData.action,
          ID);

        expect(ACLStore.createACLForResource)
          .toBeCalledWith(ID, {
            description: mockData.resourceID + ' service'
          });
      });

      it('adds grant request to callback list while creating ACL', function () {
        ACLStore.grantUserActionToResource(
          mockData.ID,
          mockData.action,
          ID);

        expect(typeof ACLStore.get('outstandingGrants')[ID][0] == 'function')
          .toBeTruthy();
      });

      it('executes multiple waiting grant requests upon ACL creation',
        function () {
          var mockedFn = jest.genMockFunction();
          var mockedFn2 = jest.genMockFunction();

          ACLStore.addOutstandingGrantRequest('service.foo', mockedFn);
          ACLStore.addOutstandingGrantRequest('service.foo', mockedFn2);

          AppDispatcher.handleServerAction({
            type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
            data: [
              {rid: 'service.foo', bar: 'baz'},
              {rid: 'service.baz', bar: 'foo'}
            ],
            resourceType: 'service'
          });

          expect(mockedFn.mock.calls.length === 1
            && mockedFn2.mock.calls.length === 1)
            .toBeTruthy();
        });

      it('only executes outstanding grant requests related to new ACL',
        function () {
          var mockedFn = jest.genMockFunction();
          var mockedFn2 = jest.genMockFunction();

          ACLStore.addOutstandingGrantRequest('service.foo', mockedFn);
          ACLStore.addOutstandingGrantRequest('service.baz', mockedFn2);

          AppDispatcher.handleServerAction({
            type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
            data: [
              {rid: 'service.foo', bar: 'baz'}
            ],
            resourceType: 'service'
          });

          expect(mockedFn.mock.calls.length === 1
            && mockedFn2.mock.calls.length === 0)
            .toBeTruthy();
        });

    });

    describe('Grant User action', function () {

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_USER_GRANT_ACTION_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
          triple: {userID: 'foo', action: 'access', resourceID: 'marathon'}
        });

        expect(mockedFn.mock.calls[0][0])
          .toEqual({userID: 'foo', action: 'access', resourceID: 'marathon'});
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_USER_GRANT_ACTION_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_ERROR,
          data: 'bar',
          triple: {userID: 'foo', action: 'access', resourceID: 'marathon'}
        });

        expect(mockedFn.mock.calls[0]).toEqual([
          'bar',
          {userID: 'foo', action: 'access', resourceID: 'marathon'}
        ]);
      });

    });

    describe('Revoke User action', function () {

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_USER_REVOKE_ACTION_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
          triple: {userID: 'foo', action: 'access', resourceID: 'marathon'}
        });

        expect(mockedFn.mock.calls[0][0])
          .toEqual({userID: 'foo', action: 'access', resourceID: 'marathon'});
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_USER_REVOKE_ACTION_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_ERROR,
          data: 'bar',
          triple: {userID: 'foo', action: 'access', resourceID: 'marathon'}
        });

        expect(mockedFn.mock.calls[0]).toEqual([
          'bar',
          {userID: 'foo', action: 'access', resourceID: 'marathon'}
        ]);
      });

    });

    describe('Grant Group action', function () {

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_GROUP_GRANT_ACTION_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
          triple: {groupID: 'foo', action: 'access', resourceID: 'marathon'}
        });

        expect(mockedFn.mock.calls[0][0])
          .toEqual({groupID: 'foo', action: 'access', resourceID: 'marathon'});
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_GROUP_GRANT_ACTION_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_ERROR,
          data: 'bar',
          triple: {groupID: 'foo', action: 'access', resourceID: 'marathon'}
        });

        expect(mockedFn.mock.calls[0]).toEqual([
          'bar',
          {groupID: 'foo', action: 'access', resourceID: 'marathon'}
        ]);
      });

    });

    describe('Revoke Group action', function () {

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_GROUP_REVOKE_ACTION_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
          triple: {groupID: 'foo', action: 'access', resourceID: 'marathon'}
        });

        expect(mockedFn.mock.calls[0][0])
          .toEqual({groupID: 'foo', action: 'access', resourceID: 'marathon'});
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jest.genMockFunction();
        ACLStore.addChangeListener(
          EventTypes.ACL_GROUP_REVOKE_ACTION_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR,
          data: 'bar',
          triple: {groupID: 'foo', action: 'access', resourceID: 'marathon'}
        });

        expect(mockedFn.mock.calls[0]).toEqual([
          'bar',
          {groupID: 'foo', action: 'access', resourceID: 'marathon'}
        ]);
      });

    });

  });

});
