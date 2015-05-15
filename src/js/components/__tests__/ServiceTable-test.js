/** @jsx React.DOM */

jest.dontMock("../ServiceTable");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../stores/MesosStateStore");
jest.dontMock("../../stores/__tests__/fixtures/state.json");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosStateStore = require("../../stores/MesosStateStore");
var ServiceTable = require("../ServiceTable");
var HealthLabels = require("../../constants/HealthLabels");

// That is a single snapshot from
// http://srv5.hw.ca1.mesosphere.com:5050/master/state.json
var stateJSON = require("../../stores/__tests__/fixtures/state.json");

MesosStateStore.init();
MesosStateStore.processSummary(stateJSON);

function getTable(isAppsProcessed) {
  return TestUtils.renderIntoDocument(
    <ServiceTable services={this.frameworks}
      healthProcessed={isAppsProcessed} />
  );
}

describe("ServiceTable", function () {

  describe("#renderHealth", function () {
    beforeEach(function () {
      this.frameworks = MesosStateStore.getFrameworks();
    });

    it("should have loaders on all frameworks", function () {
      expect(MesosStateStore.isAppsProcessed()).toBe(false);

      var table = getTable(MesosStateStore.isAppsProcessed());

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

    it("should have N/A health status on all frameworks",
        function () {
      MesosStateStore.processMarathonAppsError();
      expect(MesosStateStore.isAppsProcessed()).toBe(true);

      var table = getTable(MesosStateStore.isAppsProcessed());

      this.frameworks.slice(0).forEach(function (row) {
        var healthlabel = TestUtils.renderIntoDocument(
          table.renderHealth(null, row)
        );
        expect(healthlabel.getDOMNode().innerHTML).toEqual(HealthLabels.NA);
      });
    });
  });

});
