jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../SidePanelContents");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosSummaryActions = require("../../events/MesosSummaryActions");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var SidePanelContents = require("../SidePanelContents");

describe("SidePanelContents", function () {
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
        <SidePanelContents open={true} onClose={this.callback} />
      );

      // Mock router
      this.instance.context.router = {
        getCurrentRoutes: function () { return [1, 2, 3]; },
        transitionTo: function () {}
      };
    });

    afterEach(function () {
      this.callback.reset();
    });

    it("shouldn't call the callback after initialization", function () {
      expect(this.callback).not.toHaveBeenCalled();
    });

    it("should call the callback when the panel close is called", function () {
      this.instance.handlePanelClose();
      expect(this.callback).toHaveBeenCalled();
    });

    it("should call the callback only when panel is open", function () {
      let node = document.createElement("div");
      // Use regular render so we can check for update
      let instance = React.render(
        <SidePanelContents open={true} onClose={this.callback} />,
        node
      );
      // Mock router
      instance.context.router = this.instance.context.router;
      instance.handlePanelClose();
      expect(this.callback).toHaveBeenCalled();

      this.callback.reset();
      // Rerender with open set to false
      instance = React.render(
        <SidePanelContents open={false} onClose={this.callback} />,
        node
      );
      instance.handlePanelClose();
      instance.handlePanelClose();
      expect(this.callback).not.toHaveBeenCalled();
    });
  });

});
