jest.dontMock('../SidePanelContents');
jest.dontMock('../TaskSidePanelContents');
jest.dontMock('../TaskDirectoryView');
jest.dontMock('../../stores/MesosStateStore');
jest.dontMock('../../mixins/GetSetMixin');

var JestUtil = require('../../utils/JestUtil');

JestUtil.unMockStores(['MesosStateStore', 'TaskDirectoryStore', 'MesosSummaryStore']);
require('../../utils/StoreMixinConfig');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var MesosStateStore = require('../../stores/MesosStateStore');
var TaskSidePanelContents = require('../TaskSidePanelContents');

describe('TaskSidePanelContents', function () {
  beforeEach(function () {

    this.storeGet = MesosStateStore.get;
    this.storeChangeListener = MesosStateStore.addChangeListener;

    MesosStateStore.get = function (key) {
      if (key === 'lastMesosState') {
        return {};
      }
    };

    MesosStateStore.addChangeListener = function () {};
    MesosStateStore.getTaskFromTaskID = function () {
      return {
        id: 'fake id',
        state: 'TASK_RUNNING'
      };
    };
  });

  afterEach(function () {
    MesosStateStore.get = this.storeGet;
    MesosStateStore.addChangeListener = this.storeChangeListener;
  });

  describe('#render', function () {
    beforeEach(function () {
      this.getNodeFromID = MesosStateStore.getNodeFromID;
      MesosStateStore.getNodeFromID = function () {
        return {hostname: 'hello'};
      };
      this.container = document.createElement('div');
    });

    afterEach(function () {
      MesosStateStore.getNodeFromID = this.getNodeFromID;

      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('should return null if there are no nodes', function () {
      var instance = ReactDOM.render(
        <TaskSidePanelContents open={true} />,
        this.container
      );
      var node = ReactDOM.findDOMNode(instance);
      expect(node).toEqual(null);
    });

    it('should return an element if there is a node', function () {
      MesosStateStore.get = function () {
        return {
          slaves: {fakeProp: 'faked'}
        };
      };

      var instance = ReactDOM.render(
        <TaskSidePanelContents open={true} />,
        this.container
      );

      var node = ReactDOM.findDOMNode(instance);
      expect(TestUtils.isDOMComponent(node)).toEqual(true);
    });
  });

  describe('#getBasicInfo', function () {
    beforeEach(function () {
      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <TaskSidePanelContents open={false} />,
        this.container
      );
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('should return null if task is null', function () {
      var result = this.instance.getBasicInfo(null);
      expect(result).toEqual(null);
    });

    it('should return an element if task is not null', function () {
      var result = this.instance.getBasicInfo({
        id: 'fade',
        state: 'TASK_RUNNING'
      }, {hostname: 'hello'});

      expect(TestUtils.isElement(result)).toEqual(true);
    });
  });
});
