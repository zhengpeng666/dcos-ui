/** @jsx React.DOM */

jest.dontMock("../ServiceTable");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../stores/MesosStateStore");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosStateStore = require("../../stores/MesosStateStore");
var ServiceTable = require("../ServiceTable");
var HealthLabels = require("../../constants/HealthLabels");

MesosStateStore.init();
MesosStateStore.processState(this.__stateJSON__);

describe("ServiceTable", function () {
  var frameworks;
  var table;

  it("should initialize component with frameworks", function () {
    frameworks = MesosStateStore.getFrameworks();
    table = TestUtils.renderIntoDocument(
      <ServiceTable frameworks={frameworks} />
    );
    expect(table).toBeDefined();
  });

  it("renderHealth() should have loaders on all frameworks", function () {
    frameworks.slice(0).forEach(function (row) {
      var healthlabel = TestUtils.renderIntoDocument(
        table.renderHealth(null, row)
      );

      TestUtils.findRenderedDOMComponentWithClass(
        healthlabel, "loader-small"
      );
    });
  });

  it("should have health error processed", function () {
    expect(MesosStateStore.getHealthProcessed()).toBe(false);
    MesosStateStore.processMarathonHealthError();
    expect(MesosStateStore.getHealthProcessed()).toBe(true);
  });

  it("renderHealth() should have N/A health status on all frameworks",
      function () {
    frameworks.slice(0).forEach(function (row) {
      var healthlabel = TestUtils.renderIntoDocument(
        table.renderHealth(null, row)
      );
      expect(healthlabel.getDOMNode().innerHTML).toEqual(HealthLabels.NA);
    });
  });
});
