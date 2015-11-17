jest.dontMock("../Plugins");
jest.dontMock("../../config/Config");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../events/ConfigActions");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/ConfigStore");
jest.dontMock("../../utils/Store");

jest.setMock("../index", {
  fakePlugin: {
    initialize: jasmine.createSpy("initialize"),
    configure: jasmine.createSpy("configure"),
    isEnabled: function() {
      return true;
    }
  }
});

var Config = require("../../config/Config");
var ConfigStore = require("../../stores/ConfigStore");
var EventTypes = require("../../constants/EventTypes");
var pluginList = require("../index");
var Plugins = require("../Plugins");

describe("PluginsAPI", function () {

  describe("#initialize", function () {

    it("should call the plugin's initialize function", function () {
      Plugins.initialize();
      expect(pluginList.fakePlugin.initialize).toHaveBeenCalled();
    });

  });

  describe("#applyFilter", function () {

    beforeEach(function() {
      this.fakeFilter = jest.genMockFunction();
      this.fakeFilter.mockImplementation(function(value) {
        return value.replace("dolor", "x");
      });
      // Add a filter with the mocked function.
      Plugins.addFilter("fake_plugin_title", this.fakeFilter, 1);
    });

    it("should return the filtered content when a filter is applied",
      function () {
      var filteredContent = Plugins.applyFilter(
        "fake_plugin_title", // The plugin title.
        "Lorem ipsum dolor sit amet.", // The value to be filtered.
        "fake_filter_arguments" // The additional arguments.
      );

      // Expect the mocked function to have been called one time.
      expect(this.fakeFilter.mock.calls.length).toEqual(1);
      // Expect the arguments of the call to the mocked function to equal the
      // arguments that were included in the filter.
      expect(this.fakeFilter.mock.calls[0]).toEqual(
        ["Lorem ipsum dolor sit amet.", "fake_filter_arguments"]
      );
      // Expect the returned content to have been filtered and equal the mocked
      // filtered value.
      expect(filteredContent).toEqual("Lorem ipsum x sit amet.");
    });

  });

  describe("#doAction", function () {

    beforeEach(function() {
      this.fakeAction = jest.genMockFunction();
      // Add an action.
      Plugins.addAction("fake_action", this.fakeAction, 1);
    });

    it("should receive arguments when an action is performed", function () {
      Plugins.doAction("fake_action", "fake_action_arguments");

      // Expect the mocked function to have been called one time.
      expect(this.fakeAction.mock.calls.length).toEqual(1);
      // Expect the arguments of the call to the mocked function to equal the
      // arguments that were included in the action.
      expect(this.fakeAction.mock.calls[0][0])
        .toEqual("fake_action_arguments");
    });

  });

  // Tests that don't directly relate to a method.
  describe("Events", function () {

    beforeEach(function() {
      ConfigStore.set({config: {
        uiConfiguration: {
          plugins: {
            fakePlugin: {
              foo: "bar"
            }
          }
        }
      }});
      // Remove all previous listeners.
      ConfigStore.removeAllListeners();
    });

    it("configures plugins when store receives configuration", function () {
      Plugins.initialize();

      ConfigStore.emit(EventTypes.CONFIG_LOADED);
      expect(pluginList.fakePlugin.configure).toHaveBeenCalled();
      // The mocked function should receive the arguments defined in the plugin
      // configuration.
      expect(pluginList.fakePlugin.configure.calls[0].args).toEqual(
        [{foo: "bar"}]
      );
    });

    it("fires an action when the configuration is loaded", function () {
      Plugins.initialize();

      this.fakeAction = jest.genMockFunction();
      // Add the mocked function as the action.
      Plugins.addAction('pluginsConfigured', this.fakeAction, 1);
      ConfigStore.emit(EventTypes.CONFIG_LOADED);
      // Ensure that the action called the mocked function.
      expect(this.fakeAction.mock.calls.length).toEqual(1);
    });

    it("emits an event when when the configuration is loaded", function () {
      Plugins.initialize();
      this.fakeEventHandler = jest.genMockFunction();
      // Create an event listener with the mocked function.
      Plugins.addChangeListener(
        EventTypes.PLUGINS_CONFIGURED,
        this.fakeEventHandler
      );
      ConfigStore.emit(EventTypes.CONFIG_LOADED);
      // Ensure that the mocked function was called.
      expect(this.fakeEventHandler.mock.calls.length).toEqual(1);
    });

    it("allows listeners to be added and removed", function () {
      Plugins.initialize();
      this.fakeEventHandler = jest.genMockFunction();
      Plugins.addChangeListener(
        EventTypes.PLUGINS_CONFIGURED,
        this.fakeEventHandler
      );
      // Emit the event in question.
      ConfigStore.emit(EventTypes.CONFIG_LOADED);
      // The mocked function will have been called once because the event
      // was just emitted.
      expect(this.fakeEventHandler.mock.calls.length).toEqual(1);
      // Remove the event listener.
      Plugins.removeChangeListener(
        EventTypes.PLUGINS_CONFIGURED,
        this.fakeEventHandler
      );
      // Emit another event of the same type.
      ConfigStore.emit(EventTypes.CONFIG_LOADED);
      // The mocked function should still only have been called once, because
      // the event listener was removed.
      expect(this.fakeEventHandler.mock.calls.length).toEqual(1);
    });

  });

});
