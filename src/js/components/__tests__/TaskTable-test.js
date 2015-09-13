jest.dontMock("./fixtures/MockTasks");
jest.dontMock("../TaskTable");

var _ = require("underscore");
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

  describe("#getSortFunction", function () {
    beforeEach(function () {
      this.sortFunction = this.instance.getSortFunction("name");
      this.task = Tasks[0];
    });

    it("should return a function", function () {
      expect(_.isFunction(this.sortFunction)).toEqual(true);
    });

    it("should return a number if prop is mem", function () {
      var sortPropFunction = this.sortFunction("mem");
      expect(typeof sortPropFunction(this.task)).toEqual("number");
    });

    it("should return a number if prop is cpus", function () {
      var sortPropFunction = this.sortFunction("cpus");
      expect(typeof sortPropFunction(this.task)).toEqual("number");
    });

    it("should the most recent date if prop is updated", function () {
      var sortPropFunction = this.sortFunction("updated");
      expect(sortPropFunction(this.task))
        .toEqual(this.instance.getTaskUpdatedTimestamp(this.task));
    });

    it("should return a string if prop is name", function () {
      var sortPropFunction = this.sortFunction("name");
      expect(typeof sortPropFunction(this.task)).toEqual("string");
    });

    it("should return a string if prop is state", function () {
      var sortPropFunction = this.sortFunction("state");
      expect(typeof sortPropFunction(this.task)).toEqual("string");
    });
  });
});
