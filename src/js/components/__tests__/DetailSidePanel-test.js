jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../DetailSidePanel");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosSummaryActions = require("../../events/MesosSummaryActions");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var DetailSidePanel = require("../DetailSidePanel");

describe("DetailSidePanel", function () {
  beforeEach(function () {
    this.fetchSummary = MesosSummaryActions.fetchSummary;

    MesosSummaryActions.fetchSummary = function () {
      return null;
    };
    MesosSummaryStore.init();
  });

  afterEach(function () {
    MesosSummaryActions.fetchSummary = this.fetchSummary;
  });

  describe("callback functionality", function () {
    beforeEach(function () {
      this.callback = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <DetailSidePanel open={true} onClose={this.callback} />
      );

      // Mock router
      this.instance.context.router = {
        getCurrentRoutes: function () { return [1, 2, 3]; },
        transitionTo: function () {}
      };
    });

    it("shouldn't call the callback after initialization", function () {
      expect(this.callback).not.toHaveBeenCalled();
    });

    it("should call the callback when the panel close is called", function () {
      this.instance.handlePanelClose();
      expect(this.callback).toHaveBeenCalled();
    });
  });

});
