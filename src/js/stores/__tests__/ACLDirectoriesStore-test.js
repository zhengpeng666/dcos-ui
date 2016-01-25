jest.dontMock('../ACLDirectoriesStore');
jest.dontMock('../../config/Config');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/ACLAuthActions');
jest.dontMock('../../constants/ACLUserRoles');
jest.dontMock('../../constants/EventTypes');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../utils/Util');

var ACLDirectoriesStore = require('../ACLDirectoriesStore');
var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../events/AppDispatcher');
var EventTypes = require('../../constants/EventTypes');

describe('ACLDirectoriesStore', function () {

  describe('dispatcher', function () {

    it('stores directories when event is dispatched', function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_DIRECTORIES_SUCCESS,
        data: [{foo: 'bar'}]
      });

      var directories = ACLDirectoriesStore.get('directories').getItems();
      expect(directories[0].foo).toEqual('bar');
    });

    it('dispatches the correct event upon success', function () {
      var mockedFn = jest.genMockFunction();
      ACLDirectoriesStore.addChangeListener(
        EventTypes.ACL_DIRECTORIES_CHANGED, mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_DIRECTORIES_SUCCESS,
        data: [{foo: 'bar'}]
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

    it('dispatches the correct event upon error', function () {
      var mockedFn = jest.genMockFunction();
      ACLDirectoriesStore.addChangeListener(
        EventTypes.ACL_DIRECTORIES_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_DIRECTORIES_ERROR,
        message: 'foo'
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

  });

});
