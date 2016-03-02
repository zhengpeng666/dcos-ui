jest.dontMock('../ACLGroupsStore');
jest.dontMock('../../../../../../src/js/config/Config');
jest.dontMock('../../actions/ACLGroupsActions');
jest.dontMock('../../../../../../src/js/mixins/GetSetMixin');
jest.dontMock('../../../../../../src/js/structs/Group');
jest.dontMock('../../../../../../src/js/structs/GroupsList');
jest.dontMock('../../../../../../src/js/structs/Item');
jest.dontMock('../../../../../../src/js/structs/List');
jest.dontMock('../../../../../../tests/_fixtures/acl/groups-unicode.json');

var _ = require('underscore');
var ACLGroupsStore = require('../ACLGroupsStore');
var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../../../../../src/js/events/AppDispatcher');
var Config = require('../../../../../../src/js/config/Config');
var EventTypes = require('../../constants/EventTypes');
var groupsFixture = require('../../../../../../tests/_fixtures/acl/groups-unicode.json');
var GroupsList = require('../../../../../../src/js/structs/GroupsList');
var RequestUtil = require('../../../../../../src/js/utils/RequestUtil');

describe('ACLGroupsStore', function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = function (handlers) {
      handlers.success(groupsFixture);
    };
    this.groupsFixture = _.clone(groupsFixture);
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  it('should return an instance of GroupsList', function () {
    Config.useFixtures = true;
    ACLGroupsStore.fetchGroups();
    var groups = ACLGroupsStore.get('groups');
    expect(groups instanceof GroupsList).toBeTruthy();
  });

  it('should return all of the groups it was given', function () {
    Config.useFixtures = true;
    ACLGroupsStore.fetchGroups();
    var groups = ACLGroupsStore.get('groups').getItems();
    expect(groups.length).toEqual(this.groupsFixture.array.length);
  });

  describe('dispatcher', function () {

    it('stores groups when event is dispatched', function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_GROUPS_SUCCESS,
        data: [{gid: 'foo', bar: 'baz'}]
      });

      var groups = ACLGroupsStore.get('groups').getItems();
      expect(groups[0].gid).toEqual('foo');
      expect(groups[0].bar).toEqual('baz');
    });

    it('dispatches the correct event upon success', function () {
      var mockedFn = jest.genMockFunction();
      ACLGroupsStore.addChangeListener(EventTypes.ACL_GROUPS_CHANGE, mockedFn);
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_GROUPS_SUCCESS,
        data: [{gid: 'foo', bar: 'baz'}]
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

    it('dispatches the correct event upon error', function () {
      var mockedFn = jasmine.createSpy('mockedFn');
      ACLGroupsStore.addChangeListener(
        EventTypes.ACL_GROUPS_REQUEST_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_GROUPS_ERROR,
        data: 'foo'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo']);
    });

  });

});
