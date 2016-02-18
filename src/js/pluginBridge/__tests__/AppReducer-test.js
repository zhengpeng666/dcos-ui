jest.dontMock('../AppReducer');
jest.dontMock('../PluginBridge');
jest.dontMock('../../config/Config');
jest.dontMock('../../mixins/GetSetMixin');

var _ = require('underscore');

var EventTypes = require('../../constants/EventTypes');
var PluginBridge = require('../PluginBridge');
var PluginConstants = require('../../constants/PluginConstants');

// Get State specific to Application
function getApplicationState() {
  return PluginBridge.Store.getState()[PluginConstants.APPLICATION];
}

describe('AppReducer', function () {

  var expectedState = {
    foo: 'bar',
    qux: {foo: 'bar'}
  };

  it('should alter state correctly for storeID', function () {
    PluginBridge.dispatch({
      type: EventTypes.APP_STORE_CHANGE,
      storeID: 'foo',
      data: 'bar'
    });
    PluginBridge.dispatch({
      type: EventTypes.APP_STORE_CHANGE,
      storeID: 'qux',
      data: {foo: 'bar'}
    });
    var state = getApplicationState();

    expect(_.isEqual(state, expectedState)).toEqual(true);
  });

  it('should not alter state if action dispatched from plugin', function () {
    var pluginDispatch;
    // Mock a fake plugin
    this.mockPlugin = jest.genMockFunction().mockImplementation(
      function (Store, dispatch) {
        pluginDispatch = dispatch;
      }
    );
    this.PluginConfig = {
      fakePlugin: {
        plugin: this.mockPlugin
      }
    };
    PluginBridge.initialize(this.PluginConfig);
    pluginDispatch({
      type: EventTypes.APP_STORE_CHANGE,
      storeID: 'foo',
      data: 'boom'
    });
    var state = getApplicationState();
    expect(_.isEqual(state, expectedState)).toEqual(true);
  });

  it('should clone state', function () {
    var nestedObj = {};
    var data = {
      foo: 'bar',
      nested: nestedObj
    };
    PluginBridge.dispatch({
      type: EventTypes.APP_STORE_CHANGE,
      storeID: 'foo',
      data: data
    });
    var state = getApplicationState();

    expect(state.foo !== data).toEqual(true);
    expect(state.foo.nestedObj !== nestedObj).toEqual(true);
  });

});
