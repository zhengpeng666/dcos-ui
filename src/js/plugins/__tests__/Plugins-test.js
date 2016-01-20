jest.dontMock('../Plugins');
jest.dontMock('../../config/Config');
jest.dontMock('../../constants/EventTypes');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/ConfigActions');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../stores/ConfigStore');

jest.setMock('../index', {
  fakePlugin: {
    initialize: jasmine.createSpy('initialize'),
    configure: jasmine.createSpy('configure'),
    isEnabled: function () {
      return true;
    }
  }
});

var ConfigStore = require('../../stores/ConfigStore');
var EventTypes = require('../../constants/EventTypes');
var pluginList = require('../index');
var Plugins = require('../Plugins');

describe('PluginsAPI', function () {

  describe('#initialize', function () {

    it('should call the plugin\'s initialize function', function () {
      Plugins.initialize();
      expect(pluginList.fakePlugin.initialize).toHaveBeenCalled();
    });

    it('should call the fetchConfig method on ConfigStore', function () {
      ConfigStore.fetchConfig = jest.genMockFunction();
      Plugins.initialize();
      expect(ConfigStore.fetchConfig.mock.calls.length).toEqual(1);
    });

  });

  describe('#applyFilter', function () {

    beforeEach(function () {
      this.fakeFilter = jest.genMockFunction();
      this.fakeFilter.mockImplementation(function (value) {
        return value.replace('bar', 'baz');
      });

      Plugins.addFilter('foo', this.fakeFilter);

      this.filteredContent = Plugins.applyFilter('foo', 'foo bar', 'qux');
    });

    it('should receive the arguments that we defined', function () {
      expect(this.fakeFilter.mock.calls[0]).toEqual(['foo bar', 'qux']);
    });

    it('should call the filter once', function () {
      expect(this.fakeFilter.mock.calls.length).toEqual(1);
    });

    it('should return the filtered content when a filter is applied',
      function () {
      expect(this.filteredContent).toEqual('foo baz');
    });

    it('should apply the filters in the order of priority', function () {
      var lowPriorityFilter = jest.genMockFunction();
      var highPriorityFilter = jest.genMockFunction();

      lowPriorityFilter.mockImplementation(function (value) {
        return value.replace('bar', 'baz');
      });

      highPriorityFilter.mockImplementation(function (value) {
        return value.replace('bar', 'qux');
      });

      Plugins.addFilter('corge', lowPriorityFilter, 20);
      Plugins.addFilter('corge', highPriorityFilter, 1);

      var filteredContent = Plugins.applyFilter('corge', 'foo bar');

      expect(filteredContent).toEqual('foo qux');
    });

  });

  describe('#doAction', function () {

    beforeEach(function () {
      this.fakeAction = jest.genMockFunction();
      Plugins.addAction('foo', this.fakeAction);
    });

    it('should be called only once when an action is performed', function () {
      Plugins.doAction('foo', 'bar');
      expect(this.fakeAction.mock.calls.length).toEqual(1);
    });

    it('should receive arguments when an action is performed', function () {
      Plugins.doAction('foo', 'bar');
      expect(this.fakeAction.mock.calls[0][0]).toEqual('bar');
    });

    it('should not receive arguments when arguments are not passed',
      function () {
      this.noArgumentsAction = jest.genMockFunction();
      Plugins.addAction('qux', this.noArgumentsAction);
      Plugins.doAction('qux');
      expect(this.noArgumentsAction.mock.calls[0].length).toEqual(0);
    });

    it('should receive two arguments when two arguments are passed',
      function () {
      this.twoArgumentsAction = jest.genMockFunction();
      Plugins.addAction('quux', this.twoArgumentsAction);
      Plugins.doAction('quux', 'baz', 'bar');
      expect(this.twoArgumentsAction.mock.calls[0].length).toEqual(2);
    });

  });

  describe('Events', function () {

    beforeEach(function () {
      ConfigStore.set({config: {
        uiConfiguration: {
          plugins: {
            fakePlugin: {
              foo: 'bar'
            }
          }
        }
      }});
      Plugins.initialize();
    });

    afterEach(function () {
      ConfigStore.removeAllListeners();
    });

    it('configures plugins when store receives configuration', function () {
      ConfigStore.emit(EventTypes.CONFIG_LOADED);
      expect(pluginList.fakePlugin.configure).toHaveBeenCalled();
      expect(pluginList.fakePlugin.configure.calls[0].args).toEqual(
        [{foo: 'bar'}]
      );
    });

    it('fires an action when the configuration is loaded', function () {
      this.fakeAction = jest.genMockFunction();
      Plugins.addAction('pluginsConfigured', this.fakeAction);
      ConfigStore.emit(EventTypes.CONFIG_LOADED);
      expect(this.fakeAction.mock.calls.length).toEqual(1);
    });

    it('emits an event when when the configuration is loaded', function () {
      this.fakeEventHandler = jest.genMockFunction();
      Plugins.addChangeListener(
        EventTypes.PLUGINS_CONFIGURED,
        this.fakeEventHandler
      );
      ConfigStore.emit(EventTypes.CONFIG_LOADED);
      expect(this.fakeEventHandler.mock.calls.length).toEqual(1);
    });

    it('allows listeners to be added and removed', function () {
      this.fakeEventHandler = jest.genMockFunction();
      Plugins.addChangeListener(
        EventTypes.PLUGINS_CONFIGURED,
        this.fakeEventHandler
      );
      ConfigStore.emit(EventTypes.CONFIG_LOADED);
      expect(this.fakeEventHandler.mock.calls.length).toEqual(1);
      Plugins.removeChangeListener(
        EventTypes.PLUGINS_CONFIGURED,
        this.fakeEventHandler
      );
      ConfigStore.emit(EventTypes.CONFIG_LOADED);
      expect(this.fakeEventHandler.mock.calls.length).toEqual(1);
    });

  });

});
