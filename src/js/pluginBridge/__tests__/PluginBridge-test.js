jest.dontMock('../AppReducer');
jest.dontMock('../PluginBridge');
jest.dontMock('../../config/Config');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../stores/ConfigStore');

var _ = require('underscore');
var ConfigStore = require('../../stores/ConfigStore');
var PluginConstants = require('../../constants/PluginConstants');
var Plugins = require('../../../../plugins/index');

var PluginBridge = require('../PluginBridge');

describe('PluginBridge', function () {

  describe('#initialize', function () {

    describe('#reducers', function () {

      it('should not create a namespace in Store for plugin if no reducer returned',
        function () {
        // Mock a fake plugin
        this.mockPlugin = jest.genMockFunction().mockImplementation(
          function () {
            // Don't return anything
          }
        );

        Plugins.__setMockPlugins({fakePlugin1: this.mockPlugin});
        PluginBridge.init();
        ConfigStore.set({config: {
          uiConfiguration: {
            plugins: {
              fakePlugin1: {
                enabled: true
              }
            }
          }
        }});

        var state = PluginBridge.Store.getState();
        expect(state.fakePlugin1).toEqual(undefined);
      });

      it('should create a namespace in Store for plugin if reducer returned',
        function () {
        // Mock a fake plugin
        this.mockPlugin = jest.genMockFunction().mockImplementation(
          function () {
            // Return reducer
            return function () {
              // Return an initial state
              return {foo: 'bar'};
            };
          }
        );
        Plugins.__setMockPlugins({fakePlugin2: this.mockPlugin});
        PluginBridge.init();
        ConfigStore.set({config: {
          uiConfiguration: {
            plugins: {
              fakePlugin2: {
                enabled: true
              }
            }
          }
        }});
        var state = PluginBridge.Store.getState();
        expect(_.isEqual(state.fakePlugin2, {foo: 'bar'})).toEqual(true);
      });

      it('should throw error if reducer is not a function',
        function () {
        // Mock a fake plugin
        var mockPlugin = jest.genMockFunction().mockImplementation(
          function () {
            // Return invalid reducer
            return {};
          }
        );
        Plugins.__setMockPlugins({badFakePlugin: mockPlugin});
        PluginBridge.init();
        expect(function () {
          ConfigStore.set({config: {
            uiConfiguration: {
              plugins: {
                badFakePlugin: {
                  enabled: true
                }
              }
            }
          }});
        }).toThrow(new Error('Reducer for badFakePlugin must be a function'));
      });
    });
  });

  describe('#bootstrapPlugin', function () {

    beforeEach(function () {
      this.mockPlugin = jest.genMockFunction();

      Plugins.__setMockPlugins({fakePlugin3: this.mockPlugin});
      PluginBridge.init();
      ConfigStore.set({config: {
        uiConfiguration: {
          plugins: {
            fakePlugin3: {
              enabled: true,
              foo: 'bar'
            }
          }
        }
      }});
    });

    it('should call plugin', function () {
      expect(this.mockPlugin.mock.calls.length).toBe(1);
    });

    it('should call plugin with correct # of args', function () {
      var args = this.mockPlugin.mock.calls[0];
      expect(args.length).toBe(4);
    });

    it('should call plugin with Store as first arg', function () {
      var store = this.mockPlugin.mock.calls[0][0];
      expect(typeof store.dispatch).toEqual('function');
      expect(typeof store.subscribe).toEqual('function');
      expect(typeof store.getState).toEqual('function');
    });

    it('should call plugin with name as third arg', function () {
      var name = this.mockPlugin.mock.calls[0][2];
      expect(name).toEqual('fakePlugin3');
    });

    it('should call plugin with personal dispatch as second arg', function () {
      var store = this.mockPlugin.mock.calls[0][0];
      var dispatch = this.mockPlugin.mock.calls[0][1];
      var name = this.mockPlugin.mock.calls[0][2];
      var storeDispatch = store.dispatch;
      store.dispatch = jest.genMockFunction();
      dispatch({
        type: 'foo',
        data: 'bar'
      });
      var dispatchedObject = {
        type: 'foo',
        data: 'bar',
        __origin: name
      };
      expect(store.dispatch.mock.calls.length).toEqual(1);
      expect(_.isEqual(store.dispatch.mock.calls[0][0],
        dispatchedObject)).toEqual(true);
      // Undo
      store.dispatch = storeDispatch;
    });

    it('should call plugin with options as fourth arg', function () {
      var options = this.mockPlugin.mock.calls[0][3];
      var expectedOptions = {
        APPLICATION: PluginConstants.APPLICATION,
        config: {
          enabled: true,
          foo: 'bar'
        }
      };
      expect(_.isEqual(options, expectedOptions)).toEqual(true);
    });
  });

  describe('#store and dispatch', function () {
    beforeEach(function () {
      var mockReducer = jest.genMockFunction();
      // Mock reducer
      mockReducer.mockImplementation(function (state, action) {
        if (!state || action.type === 'reset') {
          return {foo: 1};
        }
        switch (action.type) {
          case 'foo':
            return {foo: state.foo + 1};
          case 'bar':
            return Object.assign({}, state, {bar: 'qux'});
          default:
            return state;
        }
      });

      var testArgs = {};

      // Mock a fake plugin
      this.mockPlugin = jest.genMockFunction().mockImplementation(
        function (Store, dispatch) {
          testArgs.dispatch = dispatch;
          return mockReducer;
        }
      );
      this.testArgs = testArgs;
      this.mockReducer = mockReducer;

      Plugins.__setMockPlugins({anotherFakePlugin: this.mockPlugin});
      PluginBridge.init();
      ConfigStore.set({config: {
        uiConfiguration: {
          plugins: {
            anotherFakePlugin: {
              enabled: true,
              foo: 'bar'
            }
          }
        }
      }});

    });

    it('should call reducer to get initial state', function () {
      // Redux calls the reducer 3 times to check everything
      expect(this.mockReducer.mock.calls.length).toEqual(3);
    });

    it('should call reducer with correct state', function () {
      this.testArgs.dispatch({type: 'foo'});
      var prevState = this.mockReducer.mock.calls[3][0];
      expect(_.isEqual(prevState, {foo: 1})).toEqual(true);
    });

    it('should call reducer with correct action', function () {
      this.testArgs.dispatch({type: 'foo'});
      var action = this.mockReducer.mock.calls[3][1];
      expect(_.isEqual(action, {type: 'foo', __origin: 'anotherFakePlugin'})).toEqual(true);
    });

    it('should update Store with new state #1', function () {
      this.testArgs.dispatch({type: 'reset'});
      var state = PluginBridge.Store.getState().anotherFakePlugin;
      expect(_.isEqual(state, {foo: 1})).toEqual(true);
    });

    it('should update Store with new state #2', function () {
      this.testArgs.dispatch({type: 'foo'});
      var state = PluginBridge.Store.getState().anotherFakePlugin;
      expect(_.isEqual(state, {foo: 2})).toEqual(true);
    });

    it('should update Store with new state #3', function () {
      this.testArgs.dispatch({type: 'bar'});
      var state = PluginBridge.Store.getState().anotherFakePlugin;
      expect(_.isEqual(state, {foo: 2, bar: 'qux'})).toEqual(true);
    });
  });
});

