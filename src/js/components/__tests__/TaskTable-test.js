jest.dontMock("./fixtures/MockTasks");
jest.dontMock("../../utils/ResourceTableUtil");
jest.dontMock("../TaskTable");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var TaskTable = require("../TaskTable");
const Tasks = require("./fixtures/MockTasks").tasks;

describe("TaskTable", function () {
  beforeEach(function () {
    this.instance = TestUtils.renderIntoDocument(
      <TaskTable tasks={Tasks} />
    );
  });

  describe("#getTaskUpdatedTimestamp", function () {
    it("should return the timestamp of the most recent status", function () {
      var task = Tasks[0];

      var result = this.instance.getTaskUpdatedTimestamp(task);
      var lastStatus = task.statuses[task.statuses.length - 1];
      expect(result).toEqual(lastStatus.timestamp);
    });
  });
});
