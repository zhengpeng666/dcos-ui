jest.dontMock("../../constants/StoreConfig");
jest.dontMock("../../stores/TaskDirectoryStore");
jest.dontMock("../../utils/Util");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../../structs/TaskDirectory");
jest.dontMock("../../structs/DirectoryItem");
jest.dontMock("../icons/IconDownload");
jest.dontMock("../MesosLogView");
jest.dontMock("../RequestErrorMsg");
jest.dontMock("../TaskDebugView");

require("../../utils/StoreMixinConfig");

var TaskDirectory = require("../../structs/TaskDirectory");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var TaskDirectoryActions = require("../../events/TaskDirectoryActions");
var TaskDirectoryStore = require("../../stores/TaskDirectoryStore");
var TaskDebugView = require("../TaskDebugView");

describe("TaskDebugView", function () {
  beforeEach(function () {

    // Store original versions
    this.storeGetDirectory = TaskDirectoryStore.getDirectory;
    this.taskDirectoryStoreGet = TaskDirectoryStore.get;

    // Create spies
    TaskDirectoryStore.getDirectory = jasmine.createSpy("getDirectory");
    TaskDirectoryStore.get = jasmine.createSpy("TaskDirectoryStore#get");

    this.instance = TestUtils.renderIntoDocument(
      <TaskDebugView task={{slave_id: "foo"}} />
    );

    this.instance.setState = jasmine.createSpy("setState");

  });

  afterEach(function () {
    // Restore original functions
    TaskDirectoryStore.getDirectory = this.storeGetDirectory;
    TaskDirectoryStore.get = this.taskDirectoryStoreGet;
  });

  describe("#componentDidMount", function () {

    it("should call getDirectory when component mounts", function () {
      expect(TaskDirectoryStore.getDirectory).toHaveBeenCalled();
    });

  });

  describe("#onTaskDirectoryStoreError", function () {

    it("should setState", function () {
      this.instance.onTaskDirectoryStoreError();
      expect(this.instance.setState).toHaveBeenCalled();
    });

    it("should setState increment taskDirectoryErrorCount", function () {
      this.instance.state = {taskDirectoryErrorCount: 1};
      this.instance.onTaskDirectoryStoreError();
      expect(this.instance.setState)
        .toHaveBeenCalledWith({taskDirectoryErrorCount: 2});
    });

  });

  describe("#render", function () {

    it("should call getLoadingScreen when error occured", function () {
      // Let directory return something
      TaskDirectoryStore.get = jasmine.createSpy("TaskDirectoryStore#get")
        .andReturn(new TaskDirectory({items: [{nlink: 1, path: "/stdout"}]}));

      this.instance.state = {taskDirectoryErrorCount: 3};
      this.instance.getLoadingScreen = jasmine.createSpy("getLoadingScreen");
      this.instance.render();

      expect(this.instance.getLoadingScreen).toHaveBeenCalled();
    });

    it("should call getLoadingScreen when directory is undefined", function () {
      this.instance.getLoadingScreen = jasmine.createSpy("getLoadingScreen");
      this.instance.render();

      expect(this.instance.getLoadingScreen).toHaveBeenCalled();
    });

    it("ignores getLoadingScreen when directory is defined", function () {
      // Let directory return something
      TaskDirectoryStore.get = jasmine.createSpy("TaskDirectoryStore#get")
        .andReturn(new TaskDirectory({items: [{nlink: 1, path: "/stdout"}]}));

      this.instance.getLoadingScreen = jasmine.createSpy("getLoadingScreen");
      this.instance.render();

      expect(this.instance.getLoadingScreen).not.toHaveBeenCalled();
    });

    it("renders stdout on first render", function () {
      // Let directory return something
      TaskDirectoryStore.get = jasmine.createSpy("TaskDirectoryStore#get")
        .andReturn(
          new TaskDirectory({items: [
            {nlink: 1, path: "/stdout"},
            {nlink: 2, path: "/stderr"}
          ]})
        );
      TaskDirectoryActions.getDownloadURL =
        jasmine.createSpy("TaskDirectoryActions#getDownloadURL");

      this.instance.render();

      expect(TaskDirectoryActions.getDownloadURL)
        .toHaveBeenCalledWith("foo", "/stdout");
    });

    it("renders stderr when view is changed", function () {
      // Let directory return something
      TaskDirectoryStore.get = jasmine.createSpy("TaskDirectoryStore#get")
        .andReturn(
          new TaskDirectory({items: [
            {nlink: 1, path: "/stdout"},
            {nlink: 2, path: "/stderr"}
          ]})
        );

      this.instance.state = {currentView: 1};

      // Setup spy after state has been configured
      TaskDirectoryActions.getDownloadURL =
        jasmine.createSpy("TaskDirectoryActions#getDownloadURL");

      this.instance.render();

      expect(TaskDirectoryActions.getDownloadURL)
        .toHaveBeenCalledWith("foo", "/stderr");
    });

  });

});
