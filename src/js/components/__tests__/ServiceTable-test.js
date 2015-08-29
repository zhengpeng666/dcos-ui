jest.dontMock("../ServiceOverlay");
jest.dontMock("../ServiceTable");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/MarathonStore");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../structs/SummaryList");
jest.dontMock("../../structs/StateSummary");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../stores/__tests__/fixtures/state.json");
jest.dontMock("../../utils/Store");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var ServiceTable = require("../ServiceTable");
var HealthLabels = require("../../constants/HealthLabels");

// That is a single snapshot from
// http://srv5.hw.ca1.mesosphere.com:5050/master/state.json
var stateJSON = require("../../stores/__tests__/fixtures/state.json");

MesosSummaryStore.init();
MesosSummaryStore.processSummary(stateJSON);

function getTable(isAppsProcessed) {
  return TestUtils.renderIntoDocument(
    <ServiceTable services={MesosSummaryStore.getFrameworks()}
      healthProcessed={isAppsProcessed} />
  );
}

describe("ServiceTable", function () {

  describe("#renderHealth", function () {

    beforeEach(function () {
      this.frameworks = MesosSummaryStore.getFrameworks();
    });

    it("should have loaders on all frameworks", function () {
      expect(MesosSummaryStore.get("appsProcessed")).toBe(false);

      var table = getTable(MesosSummaryStore.get("appsProcessed"));

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

    it("should have N/A health status on all frameworks", function () {
      MesosSummaryStore.onMarathonAppsError();
      expect(MesosSummaryStore.get("appsProcessed")).toBe(true);

      var table = getTable(MesosSummaryStore.get("appsProcessed"));

      this.frameworks.slice(0).forEach(function (row) {
        var healthlabel = TestUtils.renderIntoDocument(
          table.renderHealth(null, row)
        );
        expect(healthlabel.getDOMNode().innerHTML).toEqual(HealthLabels.NA);
      });

    });

  });

});
