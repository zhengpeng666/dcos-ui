jest.dontMock('./fixtures/MockTasks');
jest.dontMock('../../utils/ResourceTableUtil');
jest.dontMock('../TaskTable');
jest.dontMock('moment');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var TaskTable = require('../TaskTable');
const Tasks = require('./fixtures/MockTasks').tasks;

describe('TaskTable', function () {
  beforeEach(function () {
    this.parentRouter = {
      getCurrentRoutes: function () {
        return [{name: 'home'}, {name: 'dashboard'}, {name: 'service-detail'}];
      }
    };

    this.instance = TestUtils.renderIntoDocument(
      <TaskTable tasks={Tasks} parentRouter={this.parentRouter} />
    );
  });

  describe('#getTaskPanelRoute', function () {
    it('should be able to get the link to task detail', function () {
      var result = this.instance.getTaskPanelRoute();

      expect(result).toEqual('dashboard-task-panel');
    });
  });

  describe('#handleTaskClick', function () {
    it('should call transitionTo on parentRouter', function () {
      this.parentRouter.transitionTo = jasmine.createSpy();
      this.instance.handleTaskClick();

      expect(this.parentRouter.transitionTo).toHaveBeenCalled();
    });
  });
});
