jest.dontMock("../DetailSidePanel");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../NodeSidePanel");
jest.dontMock("../../utils/Store");
jest.dontMock("../TaskTable");
jest.dontMock("../TaskView");
jest.dontMock("../RequestErrorMsg");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosStateStore = require("../../stores/MesosStateStore");
var MesosSummaryActions = require("../../events/MesosSummaryActions");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var NodeSidePanel = require("../NodeSidePanel");

describe("NodeSidePanel", function () {
  beforeEach(function () {
    this.fetchSummary = MesosSummaryActions.fetchSummary;
    this.getTasksFromNodeID = MesosStateStore.getTasksFromNodeID;
    this.storeGet = MesosStateStore.get;

    MesosSummaryActions.fetchSummary = function () {
      return null;
    };
    MesosSummaryStore.init();
    MesosSummaryStore.processSummary({slaves: [{
      "id": "foo",
      "hostname": "bar"
    }]});

    MesosStateStore.getTasksFromNodeID = function () {
      return [];
    };
    MesosStateStore.get = function (key) {
      if (key === "lastMesosState") {
        return {};
      }
    };

    this.instance = TestUtils.renderIntoDocument(
      <NodeSidePanel open={true} onClose={this.callback} />
    );
  });

  afterEach(function () {
    MesosSummaryActions.fetchSummary = this.fetchSummary;
    MesosStateStore.getTasksFromNodeID = this.getTasksFromNodeID;
    MesosStateStore.get = this.storeGet;
  });

  it("should show error if node is not to be found", function () {
    let contents = TestUtils.renderIntoDocument(this.instance.getContents());
    let headline = TestUtils.findRenderedDOMComponentWithTag(contents, "h1");

    expect(headline.getDOMNode().textContent).toBe("Error finding node");
  });

  it("should show the nodes hostname if it is found", function () {
    this.instance = TestUtils.renderIntoDocument(
      <NodeSidePanel open={true} onClose={this.callback} nodeID="foo" />
    );
    let contents = TestUtils.renderIntoDocument(this.instance.getContents());
    let headline = TestUtils.findRenderedDOMComponentWithTag(contents, "h1");

    expect(headline.getDOMNode().textContent).toBe("bar");
  });

});
