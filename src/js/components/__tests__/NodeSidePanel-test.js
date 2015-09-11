jest.dontMock("../DetailSidePanel");
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
    MesosSummaryStore.processSummary({slaves: [{
      "id": "foo",
      "hostname": "bar"
    }]});

    this.instance = TestUtils.renderIntoDocument(
      <NodeSidePanel open={true} onClose={this.callback} />
    );
  });

  afterEach(function () {
    MesosSummaryActions.fetchSummary = this.fetchSummary;
  });

  it("should show error if node is not to be found", function () {
    let contents = TestUtils.renderIntoDocument(this.instance.getContents());
    let headline = TestUtils.findRenderedDOMComponentWithTag(contents, "h2");

    expect(headline.getDOMNode().textContent).toBe("Error finding node");
  });

  it("should show the nodes hostname if it is found", function () {
    this.instance = TestUtils.renderIntoDocument(
      <NodeSidePanel open={true} onClose={this.callback} nodeID="foo" />
    );
    let contents = TestUtils.renderIntoDocument(this.instance.getContents());
    let headline = TestUtils.findRenderedDOMComponentWithTag(contents, "h2");

    expect(headline.getDOMNode().textContent).toBe("bar");
  });

});
