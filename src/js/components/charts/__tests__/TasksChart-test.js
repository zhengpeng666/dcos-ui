/** @jsx React.DOM */

jest.dontMock("../TasksChart");

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var TasksChart = require("../TasksChart");

describe("TasksChart", function () {

  describe("#getTaskInfo", function () {

    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <TasksChart tasks={[]} />
      );
    });

    it("renders two task info labels when there is no data", function () {
      var unitsRow = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, "row"
      )[1];
      var taskLabels = TestUtils.scryRenderedDOMComponentsWithClass(
        unitsRow, "unit"
      );
      expect(taskLabels.length).toEqual(2);
    });

    it("renders two task info labels when there is only data for one", function () {
      this.instance.setProps({
        tasks: [
          {state: "TASK_RUNNING", tasks: [{ id: "task1", name: "Task 1" }]}
        ]
      });
      var unitsRow = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, "row"
      )[1];
      var taskLabels = TestUtils.scryRenderedDOMComponentsWithClass(
        unitsRow, "unit"
      );
      expect(taskLabels.length).toEqual(2);
    });

  });

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
