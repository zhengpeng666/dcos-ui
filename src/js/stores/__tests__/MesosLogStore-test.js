jest.dontMock("../MesosLogStore");
jest.dontMock("../../config/Config");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../events/MesosLogActions");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../structs/LogBuffer");
jest.dontMock("../../structs/Item");
jest.dontMock("../../structs/List");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");

var MesosLogStore = require("../MesosLogStore");
var ActionTypes = require("../../constants/ActionTypes");
var AppDispatcher = require("../../events/AppDispatcher");
var Config = require("../../config/Config");
var EventTypes = require("../../constants/EventTypes");
var LogBuffer = require("../../structs/LogBuffer");
var RequestUtil = require("../../utils/RequestUtil");

describe("MesosLogStore", function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = jasmine.createSpy();
    MesosLogStore.startTailing("foo", "/bar");
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  describe("#startTailing", function () {

    it("should return an instance of LogBuffer", function () {
      var logBuffer = MesosLogStore.get("/bar");
      expect(logBuffer instanceof LogBuffer).toBeTruthy();
    });

  });

  describe("#stopTailing", function () {

    it("should return an instance of LogBuffer", function () {
      MesosLogStore.stopTailing("/bar");
      var logBuffer = MesosLogStore.get("/bar");
      expect(logBuffer).toEqual(undefined);
    });

  });

  describe("#processLogEntry", function () {

    beforeEach(function () {
      // First item will be used to initialize
      MesosLogStore.processLogEntry("foo", "/bar", {data: "", offset: 100});
      // Two next processes will be stored
      MesosLogStore.processLogEntry("foo", "/bar", {data: "foo", offset: 100});
      MesosLogStore.processLogEntry("foo", "/bar", {data: "bar", offset: 103});
      this.logBuffer = MesosLogStore.get("/bar");
    });

    it("should return all of the log items it was given", function () {
      let items = this.logBuffer.getItems();
      expect(items.length).toEqual(2);
    });

    it("should return the full log of items it was given", function () {
      expect(this.logBuffer.getFullLog()).toEqual("foobar");
    });

    it("should call the fetch log 4 times", function (done) {
      setTimeout(function () {
        expect(RequestUtil.json.callCount).toEqual(4);
        done();
      }, Config.tailRefresh);
    });

  });

  describe("#processLogError", function () {

    beforeEach(function () {
      this.logBuffer = MesosLogStore.get("/bar");
    });

    it("should be initialized after initialize and before error", function () {
      // First item will be used to initialize
      MesosLogStore.processLogEntry("foo", "/bar", {data: "", offset: 100});
      expect(this.logBuffer.isInitialized()).toEqual(true);
    });

    it("should not be initialized after error", function () {
      MesosLogStore.processLogError("foo", "/bar");
      expect(this.logBuffer.isInitialized()).toEqual(false);
    });

    it("should try to restart the tailing after error", function (done) {
      MesosLogStore.processLogError("foo", "/bar");
      setTimeout(function () {
        expect(RequestUtil.json.callCount).toEqual(2);
        done();
      }, Config.tailRefresh);
    });

  });

  describe("dispatcher", function () {

    it("stores log entry when event is dispatched", function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_LOG_SUCCESS,
        data: {data: "", offset: 100},
        path: "/bar",
        slaveID: "foo"
      });

      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_LOG_SUCCESS,
        data: {data: "foo", offset: 100},
        path: "/bar",
        slaveID: "foo"
      });

      var log = MesosLogStore.get("/bar").getFullLog();
      expect(log).toEqual("foo");
    });

    it("dispatches the correct event upon success", function () {
      var mockedFn = jest.genMockFunction();
      MesosLogStore.addChangeListener(EventTypes.MESOS_LOG_CHANGE, mockedFn);
      // Initializing call
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_LOG_SUCCESS,
        data: {data: "", offset: 100},
        path: "/bar",
        slaveID: "foo"
      });
      // Actual data processing
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_LOG_SUCCESS,
        data: {data: "foo", offset: 100},
        path: "/bar",
        slaveID: "foo"
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

    it("dispatches the correct event upon error", function () {
      var mockedFn = jest.genMockFunction();
      MesosLogStore.addChangeListener(
        EventTypes.MESOS_LOG_REQUEST_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_LOG_ERROR,
        path: "/bar",
        slaveID: "foo"
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

  });

});
