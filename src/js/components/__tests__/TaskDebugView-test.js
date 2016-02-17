jest.dontMock('../icons/IconDownload');
jest.dontMock('../MesosLogView');
jest.dontMock('../RequestErrorMsg');
jest.dontMock('../TaskDebugView');

var JestUtil = require('../../utils/JestUtil');

JestUtil.unMockStores(['TaskDirectoryStore', 'MesosLogStore']);
require('../../utils/StoreMixinConfig');

var TaskDirectory = require('../../structs/TaskDirectory');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var TaskDirectoryActions = require('../../events/TaskDirectoryActions');
var TaskDirectoryStore = require('../../stores/TaskDirectoryStore');
var TaskDebugView = require('../TaskDebugView');

describe('TaskDebugView', function () {
  beforeEach(function () {
    // Store original versions
    this.storeGetDirectory = TaskDirectoryStore.getDirectory;

    // Create spies
    TaskDirectoryStore.getDirectory = jasmine.createSpy('getDirectory');

    this.container = document.createElement('div');
    this.instance = ReactDOM.render(
      <TaskDebugView task={{slave_id: 'foo'}} />,
      this.container
    );

    this.instance.setState = jasmine.createSpy('setState');

  });

  afterEach(function () {
    // Restore original functions
    TaskDirectoryStore.getDirectory = this.storeGetDirectory;

    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#componentDidMount', function () {

    it('should call getDirectory when component mounts', function () {
      expect(TaskDirectoryStore.getDirectory).toHaveBeenCalled();
    });

  });

  describe('#onTaskDirectoryStoreError', function () {

    it('should setState', function () {
      this.instance.onTaskDirectoryStoreError();
      expect(this.instance.setState).toHaveBeenCalled();
    });

    it('should setState increment taskDirectoryErrorCount', function () {
      this.instance.state = {taskDirectoryErrorCount: 1};
      this.instance.onTaskDirectoryStoreError();
      expect(this.instance.setState)
        .toHaveBeenCalledWith({taskDirectoryErrorCount: 2});
    });

  });

  describe('#onTaskDirectoryStoreSuccess', function () {

    it('should setState', function () {
      this.instance.onTaskDirectoryStoreSuccess();
      expect(this.instance.setState).toHaveBeenCalled();
    });

    it('should setState increment onTaskDirectoryStoreSuccess', function () {
      var directory = new TaskDirectory({items: [{nlink: 1, path: '/stdout'}]});
      // Let directory return something
      TaskDirectoryStore.get = jasmine.createSpy('TaskDirectoryStore#get')
        .andReturn(directory);

      this.instance.onTaskDirectoryStoreSuccess();
      expect(this.instance.setState)
        .toHaveBeenCalledWith({directory});
    });

  });

  describe('#render', function () {

    it('should call getErrorScreen when error occured', function () {
      this.instance.state = {
        currentView: 0,
        directory: new TaskDirectory({items: [{nlink: 1, path: '/stdout'}]}),
        taskDirectoryErrorCount: 3
      };
      this.instance.getErrorScreen = jasmine.createSpy('getErrorScreen');
      this.instance.render();

      expect(this.instance.getErrorScreen).toHaveBeenCalled();
    });

    it('ignores getErrorScreen when error has not occured', function () {
      this.instance.state = {
        currentView: 0,
        directory: new TaskDirectory({items: [{nlink: 1, path: '/stdout'}]})
      };
      this.instance.getErrorScreen = jasmine.createSpy('getErrorScreen');
      this.instance.render();

      expect(this.instance.getErrorScreen).not.toHaveBeenCalled();
    });

    it('should set button disabled when file is not found', function () {
      var instance = ReactDOM.render(
        <TaskDebugView task={{slave_id: 'foo'}} />,
        document.createElement('div')
      );
      instance.setState({
        currentView: 0,
        directory: new TaskDirectory({items: [{nlink: 1, path: '/foo'}]})
      });
      var btn = TestUtils.findRenderedDOMComponentWithTag(instance, 'a');
      // If btn.props.disabled = true, then disabled attribute will return an object.
      // If btn.props.disabled = false, then disabled attribute will be undefined.
      // So here we just test to see if attribute exists
      expect(btn.attributes.disabled).toBeTruthy();
    });

    it('should set button not disabled when file is found', function () {
      var instance = ReactDOM.render(
        <TaskDebugView task={{slave_id: 'foo'}} />,
        document.createElement('div')
      );
      instance.setState({
        currentView: 0,
        directory: new TaskDirectory({items: [{nlink: 1, path: '/stdout'}]})
      });
      var btn = TestUtils.findRenderedDOMComponentWithTag(instance, 'a');
      // If btn.props.disabled = false, then disabled attribute will be undefined
      expect(btn.attributes.disabled).toEqual(undefined);
    });

    it('renders stdout on first render', function () {
      this.instance.state = {
        currentView: 0,
        directory: new TaskDirectory({items: [{nlink: 1, path: '/stdout'}]})
      };
      TaskDirectoryActions.getDownloadURL =
        jasmine.createSpy('TaskDirectoryActions#getDownloadURL');

      this.instance.render();

      expect(TaskDirectoryActions.getDownloadURL)
        .toHaveBeenCalledWith('foo', '/stdout');
    });

    it('renders stderr when view is changed', function () {
      this.instance.state = {
        currentView: 1,
        directory: new TaskDirectory({items: [
          {nlink: 1, path: '/stdout'},
          {nlink: 1, path: '/stderr'}
        ]})
      };

      // Setup spy after state has been configured
      TaskDirectoryActions.getDownloadURL =
        jasmine.createSpy('TaskDirectoryActions#getDownloadURL');

      this.instance.render();

      expect(TaskDirectoryActions.getDownloadURL)
        .toHaveBeenCalledWith('foo', '/stderr');
    });

  });

});
