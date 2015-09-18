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
});
