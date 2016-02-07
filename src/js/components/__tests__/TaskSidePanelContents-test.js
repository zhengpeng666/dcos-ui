jest.dontMock('../SidePanelContents');
jest.dontMock('../TaskSidePanelContents');
jest.dontMock('../TaskDirectoryView');
jest.dontMock('../../constants/TaskStates');
jest.dontMock('../../stores/MesosStateStore');
jest.dontMock('../../events/MesosStateActions');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../utils/Util');

require('../../utils/StoreMixinConfig');

var React = require('react');
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
    });

    afterEach(function () {
      MesosStateStore.getNodeFromID = this.getNodeFromID;
    });

    it('should return null if there are no nodes', function () {
      var instance = TestUtils.renderIntoDocument(
        <TaskSidePanelContents open={true} />
      );
      expect(instance.render()).toEqual(null);
    });

    it('should return an element if there is a node', function () {
      MesosStateStore.get = function () {
        return {
          slaves: {fakeProp: 'faked'}
        };
      };

      var instance = TestUtils.renderIntoDocument(
        <TaskSidePanelContents open={true} />
      );

      expect(TestUtils.isElement(instance.render())).toEqual(true);
    });
  });

  describe('#getBasicInfo', function () {
    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <TaskSidePanelContents open={false} />
      );
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
