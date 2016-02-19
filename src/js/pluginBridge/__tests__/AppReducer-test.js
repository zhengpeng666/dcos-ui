jest.dontMock('../AppReducer');
jest.dontMock('../PluginBridge');
jest.dontMock('../../config/Config');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../stores/ConfigStore');

var _ = require('underscore');

var ConfigStore = require('../../stores/ConfigStore');
var EventTypes = require('../../constants/EventTypes');
var PluginBridge = require('../PluginBridge');
var PluginConstants = require('../../constants/PluginConstants');
var Plugins = require('../../../../plugins/index');

// Get State specific to Application
function getApplicationState() {
  return PluginBridge.Store.getState()[PluginConstants.APPLICATION];
}

describe('AppReducer', function () {

  var expectedState = {
    foo: 'bar',
    qux: {foo: 'bar'}
  };

  it('should alter state correctly when no plugins loaded', function () {
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
    PluginBridge.listenForConfigChange();

    var state = getApplicationState();

    expect(_.isEqual(state, expectedState)).toEqual(true);
  });

  it('should alter state correctly after plugins loaded', function () {
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
    // Mock a fake plugin
    var mockPlugin = jest.genMockFunction().mockImplementation(
      function () {
        return function () {
          return {foo: 'bar'};
        };
      }
    );

    Plugins.__setMockPlugins({fakePlugin: mockPlugin});
    PluginBridge.listenForConfigChange();
    ConfigStore.set({config: {
      uiConfiguration: {
        plugins: {
          fakePlugin: {
            enabled: true
          }
        }
      }
    }});
    var state = getApplicationState();
    // lets remove the config stuff just for ease
    delete state.config;
    expect(_.isEqual(state, expectedState)).toEqual(true);
  });

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
    // lets remove the config stuff just for ease
    delete state.config;
    expect(_.isEqual(state, expectedState)).toEqual(true);
  });

  it('should not alter state if action dispatched from plugin', function () {
    var pluginDispatch;
    // Mock a fake plugin
    var mockPlugin = jest.genMockFunction().mockImplementation(
      function (Store, dispatch) {
        pluginDispatch = dispatch;
      }
    );
    Plugins.__setMockPlugins({fakePluginAgain: mockPlugin});
    PluginBridge.listenForConfigChange();
    ConfigStore.set({config: {
      uiConfiguration: {
        plugins: {
          fakePluginAgain: {
            enabled: true
          }
        }
      }
    }});

    pluginDispatch({
      type: EventTypes.APP_STORE_CHANGE,
      storeID: 'foo',
      data: 'boom'
    });
    var state = getApplicationState();
    // lets remove the config stuff just for ease
    delete state.config;
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
