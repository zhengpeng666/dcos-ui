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
  var table;

  beforeEach(function () {
    this.frameworks = MesosStateStore.getFrameworks();
  });

  it("should initialize component with frameworks", function () {
    table = TestUtils.renderIntoDocument(
      <ServiceTable frameworks={this.frameworks} />
    );
    expect(table).toBeDefined();
  });

  describe("#renderHealth", function () {
    it("should have loaders on all frameworks", function () {
      this.frameworks.slice(0).forEach(function (row) {
        var healthlabel = TestUtils.renderIntoDocument(
          table.renderHealth(null, row)
        );

        var fn = TestUtils.findRenderedDOMComponentWithClass.bind(TestUtils,
          healthlabel, "loader-small"
        );
        expect(fn).not.toThrow();
      });
    });
  });

  it("should have health error processed", function () {
    expect(MesosStateStore.getHealthProcessed()).toBe(false);
    MesosStateStore.processMarathonHealthError();
    expect(MesosStateStore.getHealthProcessed()).toBe(true);
  });

  describe("#renderHealth", function () {
    it("should have N/A health status on all frameworks",
        function () {
      this.frameworks.slice(0).forEach(function (row) {
        var healthlabel = TestUtils.renderIntoDocument(
          table.renderHealth(null, row)
        );
        expect(healthlabel.getDOMNode().innerHTML).toEqual(HealthLabels.NA);
      });
    });
  });

});
