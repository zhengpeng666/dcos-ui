jest.dontMock("../DetailSidePanel");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../NodeSidePanel");
jest.dontMock("../../utils/Store");
jest.dontMock("../TaskTable");
jest.dontMock("../TaskView");
jest.dontMock("../RequestErrorMsg");
jest.dontMock("../../utils/Util");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosStateStore = require("../../stores/MesosStateStore");
var MesosSummaryActions = require("../../events/MesosSummaryActions");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var NodeSidePanel = require("../NodeSidePanel");

function renderAndFindTag(instance, tag) {
  var result = TestUtils.renderIntoDocument(instance);
  return TestUtils.findRenderedDOMComponentWithTag(result, tag);
}

describe("NodeSidePanel", function () {
  beforeEach(function () {
    this.fetchSummary = MesosSummaryActions.fetchSummary;
    this.getTasksFromNodeID = MesosStateStore.getTasksFromNodeID;
    this.storeGet = MesosStateStore.get;
    this.storeGetNode = MesosStateStore.getNodeFromID;

    MesosSummaryActions.fetchSummary = function () {
      return null;
    };
    MesosStateStore.getTasksFromNodeID = function () {
      return [];
    };
    MesosStateStore.get = function (key) {
      if (key === "lastMesosState") {
        return {};
      }
    };
    MesosStateStore.getNodeFromID = function (id) {
      if (id === "nonExistent") {
        return null;
      }

      return {
        id: "existingNode",
        version: "10",
        active: true,
        registered_time: 10
      };
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
    MesosStateStore.getTasksFromNodeID = this.getTasksFromNodeID;
    MesosStateStore.get = this.storeGet;
    MesosStateStore.getNodeFromID = this.storeGetNode;
  });

  describe("#getTabView", function () {

    it("should return null if node does not exist", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanel open={true} itemID="nonExistent" />
      );

      var result = instance.getTabView();
      expect(result).toEqual(null);
    });

    it("should return a node if node exists", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanel open={true} itemID="existingNode" />
      );

      var result = instance.getTabView({
        id: "existingNode",
        version: "10",
        active: true,
        registered_time: 10
      });
      expect(TestUtils.isElement(result)).toEqual(true);
    });
  });

  describe("#getKeyValuePairs", function () {

    it("should return an empty set if node does not exist", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanel open={true} itemID="nonExistent" />
      );

      var result = instance.getKeyValuePairs({});
      expect(result).toEqual(null);
    });

    it("should return null if undefined is passed", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanel open={true} itemID="nonExistent" />
      );

      var result = instance.getKeyValuePairs();
      expect(result).toEqual(null);
    });

    it("should return a node of elements if node exists", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanel open={true} itemID="existingNode" />
      );

      var result = instance.getKeyValuePairs({"foo": "bar"});
      expect(TestUtils.isElement(result)).toEqual(true);
    });

    it("should return a headline if headline string is given", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanel open={true} itemID="existingNode" />
      );

      let headline = renderAndFindTag(
        instance.getKeyValuePairs({"foo": "bar"}, "baz"),
        "h3"
      );

      expect(TestUtils.isDOMComponent(headline)).toEqual(true);
    });
  });

  it("should show error if node is not to be found", function () {
    let contents = TestUtils.renderIntoDocument(this.instance.getContents());
    let headline = TestUtils.findRenderedDOMComponentWithTag(contents, "h1");

    expect(headline.getDOMNode().textContent).toBe("Error finding node");
  });

  it("should show the nodes hostname if it is found", function () {
    var instance = TestUtils.renderIntoDocument(
      <NodeSidePanel open={true} onClose={this.callback} itemID="foo" />
    );
    let contents = TestUtils.renderIntoDocument(instance.getContents());
    let headline = TestUtils.findRenderedDOMComponentWithClass(
      contents, "side-panel-content-header-label"
    );

    expect(headline.getDOMNode().textContent).toBe("bar");
  });
});
