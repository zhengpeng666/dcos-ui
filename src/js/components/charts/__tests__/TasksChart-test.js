/** @jsx React.DOM */

jest.dontMock("../TasksChart");

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var TasksChart = require("../TasksChart");

describe("TasksChart", function () {

  describe("#shouldComponentUpdate", function () {

    beforeEach(function () {
      this.tasks = [
        {state: "TASK_RUNNING", tasks: [{id: "foo", name: "datanode"}]}
      ];

      this.instance = TestUtils.renderIntoDocument(
        <TasksChart tasks={this.tasks} />
      );
    });

    it("should allow update", function () {
      this.tasks.push(_.clone(_.first(this.tasks)));
      var shouldUpdate = this.instance.shouldComponentUpdate(this.tasks);
      expect(shouldUpdate).toEqual(true);
    });

    it("should not allow update", function () {
      var shouldUpdate = this.instance.shouldComponentUpdate(
        this.instance.props
      );
      expect(shouldUpdate).toEqual(false);
    });

  });

});
