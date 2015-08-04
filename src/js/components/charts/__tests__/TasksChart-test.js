jest.dontMock("../TasksChart");

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var TasksChart = require("../TasksChart");

describe("TasksChart", function () {

  describe("#getTaskInfo", function () {

    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <TasksChart tasks={{}} />
      );
    });

    it("renders two task info labels when there is no data", function () {
      var rows = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, "row"
      );
      var unitsRow = _.last(rows);
      var taskLabels = TestUtils.scryRenderedDOMComponentsWithClass(
        unitsRow, "unit"
      );
      expect(taskLabels.length).toEqual(2);
    });

    it("renders two task info labels when there is only data for one", function () {
      this.instance.setProps({tasks: {TASK_RUNNING: 1}});
      var rows = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, "row"
      );
      var unitsRow = _.last(rows);
      var taskLabels = TestUtils.scryRenderedDOMComponentsWithClass(
        unitsRow, "unit"
      );
      expect(taskLabels.length).toEqual(2);
    });

  });

  describe("#shouldComponentUpdate", function () {

    beforeEach(function () {
      this.tasks = {TASK_RUNNING: 0};

      this.instance = TestUtils.renderIntoDocument(
        <TasksChart tasks={this.tasks} />
      );
    });

    it("should allow update", function () {
      this.tasks.TASK_STAGING = 1;
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

  describe("#getDialChartChildren", function () {

    beforeEach(function () {
      var parent = TestUtils.renderIntoDocument(
        <TasksChart tasks={{}} />
      );
      this.instance = TestUtils.renderIntoDocument(
        parent.getDialChartChildren(100)
      );
    });

    it("renders its unit", function () {
      var unit = TestUtils.findRenderedDOMComponentWithClass(
        this.instance, "unit"
      );
      expect(unit.getDOMNode().textContent).toEqual("100");
    });

    it("renders its label", function () {
      var label = TestUtils.findRenderedDOMComponentWithClass(
        this.instance, "unit-label"
      );
      expect(label.getDOMNode().textContent).toEqual("Total Tasks");
    });

  });

});
