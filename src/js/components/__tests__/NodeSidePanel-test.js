jest.dontMock("../NodeSidePanel");
jest.dontMock("../../utils/Store");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var NodeSidePanel = require("../NodeSidePanel");

describe("NodeSidePanel", function () {
  beforeEach(function () {
    this.summaryGetNodeFromID = MesosSummaryStore.getNodeFromID;

    MesosSummaryStore.getNodeFromID = function () {
      return null;
    };
  });

  afterEach(function () {
    MesosSummaryStore.getNodeFromID = this.summaryGetNodeFromID;
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
