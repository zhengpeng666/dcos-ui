/** @jsx React.DOM */

jest.dontMock("../Table");
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
  });

  it("should have as many loader as frameworks", function () {
    var loader = TestUtils.scryRenderedDOMComponentsWithClass(
      table, "loader-small"
    );

    expect(frameworks.length).toEqual(loader.length);
  });

  it("should have health error processed", function () {
    MesosStateStore.processMarathonHealthError();
    expect(MesosStateStore.getHealthProcessed()).toBe(true);
  });

  it("should have N/A health status on all frameworks", function () {
    var status = TestUtils.scryRenderedDOMComponentsWithClass(
      table, "collection-item-content-status"
    );

    status.forEach(function (state) {
      expect(state.getDOMNode().innerHTML).toEqual(HealthLabels.NA);
    });
  });
});
