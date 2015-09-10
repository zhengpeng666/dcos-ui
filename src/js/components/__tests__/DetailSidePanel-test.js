jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../NodeSidePanel");
jest.dontMock("../../utils/Store");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosSummaryActions = require("../../events/MesosSummaryActions");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var NodeSidePanel = require("../NodeSidePanel");

describe("NodeSidePanel", function () {
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
        <NodeSidePanel open={false} onClose={this.callback} />
      );
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
