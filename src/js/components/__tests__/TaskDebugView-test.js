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

    // Create spies
    TaskDirectoryStore.getDirectory = jasmine.createSpy("getDirectory");

    this.instance = TestUtils.renderIntoDocument(
      <TaskDebugView task={{slave_id: "foo"}} />
    );

    this.instance.setState = jasmine.createSpy("setState");

  });

  afterEach(function () {
    // Restore original functions
    TaskDirectoryStore.getDirectory = this.storeGetDirectory;
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

    it("should call getErrorScreen when error occured", function () {
      this.instance.state = {
        currentView: 0,
        directory: new TaskDirectory({items: [{nlink: 1, path: "/stdout"}]}),
        taskDirectoryErrorCount: 3
      };
      this.instance.getErrorScreen = jasmine.createSpy("getErrorScreen");
      this.instance.render();

      expect(this.instance.getErrorScreen).toHaveBeenCalled();
    });

    it("should call getLoadingScreen when directory is undefined", function () {
      this.instance.getLoadingScreen = jasmine.createSpy("getLoadingScreen");
      this.instance.render();

      expect(this.instance.getLoadingScreen).toHaveBeenCalled();
    });

    it("ignores getLoadingScreen when directory is defined", function () {
      this.instance.state = {
        currentView: 0,
        directory: new TaskDirectory({items: [{nlink: 1, path: "/stdout"}]})
      };
      this.instance.getLoadingScreen = jasmine.createSpy("getLoadingScreen");
      this.instance.render();

      expect(this.instance.getLoadingScreen).not.toHaveBeenCalled();
    });

    it("ignores getErrorScreen when directory is defined", function () {
      this.instance.state = {
        currentView: 0,
        directory: new TaskDirectory({items: [{nlink: 1, path: "/stdout"}]})
      };
      this.instance.getErrorScreen = jasmine.createSpy("getErrorScreen");
      this.instance.render();

      expect(this.instance.getErrorScreen).not.toHaveBeenCalled();
    });

    it("renders stdout on first render", function () {
      this.instance.state = {
        currentView: 0,
        directory: new TaskDirectory({items: [{nlink: 1, path: "/stdout"}]})
      };
      TaskDirectoryActions.getDownloadURL =
        jasmine.createSpy("TaskDirectoryActions#getDownloadURL");

      this.instance.render();

      expect(TaskDirectoryActions.getDownloadURL)
        .toHaveBeenCalledWith("foo", "/stdout");
    });

    it("renders stderr when view is changed", function () {
      this.instance.state = {
        currentView: 1,
        directory: new TaskDirectory({items: [
          {nlink: 1, path: "/stdout"},
          {nlink: 1, path: "/stderr"}
        ]})
      };

      // Setup spy after state has been configured
      TaskDirectoryActions.getDownloadURL =
        jasmine.createSpy("TaskDirectoryActions#getDownloadURL");

      this.instance.render();

      expect(TaskDirectoryActions.getDownloadURL)
        .toHaveBeenCalledWith("foo", "/stderr");
    });

  });

});
