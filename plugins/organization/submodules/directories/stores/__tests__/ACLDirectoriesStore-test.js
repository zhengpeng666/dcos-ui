jest.dontMock('../ACLDirectoriesStore');
jest.dontMock('../../actions/ACLDirectoriesActions');

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock(['List']);

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

var ACLDirectoriesStore = require('../ACLDirectoriesStore');
var ActionTypes = require('../../constants/ActionTypes');
var EventTypes = require('../../constants/EventTypes');

var AppDispatcher = require('../../../../../../src/js/events/AppDispatcher');

describe('ACLDirectoriesStore dispatcher', function () {

  describe('fetch', function () {

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

  describe('add', function () {

    it('dispatches the correct event upon success', function () {
      var mockedFn = jest.genMockFunction();
      ACLDirectoriesStore.addChangeListener(
        EventTypes.ACL_DIRECTORY_ADD_SUCCESS, mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_DIRECTORY_ADD_SUCCESS
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

    it('dispatches the correct event upon error', function () {
      var mockedFn = jest.genMockFunction();
      ACLDirectoriesStore.addChangeListener(
        EventTypes.ACL_DIRECTORY_ADD_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_DIRECTORY_ADD_ERROR,
        message: 'foo'
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

  });

  describe('delete', function () {

    it('removes stored directories after delete', function () {
      ACLDirectoriesStore.set({directories: 'foo'});
      expect(ACLDirectoriesStore.get('directories')).toEqual('foo');

      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_DIRECTORY_DELETE_SUCCESS
      });

      expect(ACLDirectoriesStore.get('directories')).toEqual(null);
    });

    it('dispatches the correct event upon success', function () {
      var mockedFn = jest.genMockFunction();
      ACLDirectoriesStore.addChangeListener(
        EventTypes.ACL_DIRECTORY_DELETE_SUCCESS, mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_DIRECTORY_DELETE_SUCCESS
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

    it('dispatches the correct event upon error', function () {
      var mockedFn = jest.genMockFunction();
      ACLDirectoriesStore.addChangeListener(
        EventTypes.ACL_DIRECTORY_DELETE_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_DIRECTORY_DELETE_ERROR,
        message: 'foo'
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

  });

});
