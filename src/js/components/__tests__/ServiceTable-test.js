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
MesosStateStore.processState(stateJSON);

describe("ServiceTable", function () {

  describe("#renderHealth", function () {
    beforeEach(function () {
      this.frameworks = MesosStateStore.getFrameworks();
      this.table = TestUtils.renderIntoDocument(
        <ServiceTable frameworks={this.frameworks} />
      );
    });

    it("should have loaders on all frameworks", function () {
      expect(MesosStateStore.getHealthProcessed()).toBe(false);

      this.frameworks.slice(0).forEach(function (row) {
        var healthlabel = TestUtils.renderIntoDocument(
          this.table.renderHealth(null, row)
        );

        var fn = TestUtils.findRenderedDOMComponentWithClass.bind(TestUtils,
          healthlabel, "loader-small"
        );
        expect(fn).not.toThrow();
      }.bind(this));
    });

    it("should have N/A health status on all frameworks",
        function () {
      MesosStateStore.processMarathonHealthError();
      expect(MesosStateStore.getHealthProcessed()).toBe(true);

      this.frameworks.slice(0).forEach(function (row) {
        var healthlabel = TestUtils.renderIntoDocument(
          this.table.renderHealth(null, row)
        );
        expect(healthlabel.getDOMNode().innerHTML).toEqual(HealthLabels.NA);
      }.bind(this));
    });
  });

});
