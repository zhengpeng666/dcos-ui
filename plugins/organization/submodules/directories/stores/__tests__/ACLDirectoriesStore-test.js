jest.dontMock('../ACLDirectoriesStore');
jest.dontMock('../../actions/ACLDirectoriesActions');

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock(['List']);

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

var ACLDirectoriesStore = require('../ACLDirectoriesStore');
var OrganizationReducer = require('../../../../Reducer');
var ActionTypes = require('../../constants/ActionTypes');
var EventTypes = require('../../constants/EventTypes');

PluginTestUtils.addReducer('organization', OrganizationReducer);

describe('ACLDirectoriesStore dispatcher', function () {

  describe('fetch', function () {

    it('stores directories when event is dispatched', function () {
      SDK.dispatch({
        type: ActionTypes.REQUEST_ACL_DIRECTORIES_SUCCESS,
        data: [{foo: 'bar'}]
      });

      var directories = ACLDirectoriesStore.getDirectories().getItems();
      expect(directories[0].foo).toEqual('bar');
    });

    it('dispatches the correct event upon success', function () {
      var mockedFn = jest.genMockFunction();
      ACLDirectoriesStore.addChangeListener(
        EventTypes.ACL_DIRECTORIES_CHANGED, mockedFn
      );
      SDK.dispatch({
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
      SDK.dispatch({
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
      SDK.dispatch({
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
      SDK.dispatch({
        type: ActionTypes.REQUEST_ACL_DIRECTORY_ADD_ERROR,
        message: 'foo'
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

  });

  describe('delete', function () {

    it('removes stored directories after delete', function () {
      ACLDirectoriesStore.processDirectoriesSuccess(['foo']);
      expect(ACLDirectoriesStore.getDirectories().getItems()).toEqual(['foo']);

      SDK.dispatch({
        type: ActionTypes.REQUEST_ACL_DIRECTORY_DELETE_SUCCESS
      });

      expect(ACLDirectoriesStore.getDirectories().getItems()).toEqual([]);
    });

    it('dispatches the correct event upon success', function () {
      var mockedFn = jest.genMockFunction();
      ACLDirectoriesStore.addChangeListener(
        EventTypes.ACL_DIRECTORY_DELETE_SUCCESS, mockedFn
      );
      SDK.dispatch({
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
      SDK.dispatch({
        type: ActionTypes.REQUEST_ACL_DIRECTORY_DELETE_ERROR,
        message: 'foo'
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

  });

});
