jest.dontMock("../SidePanelContents");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../mixins/TabsMixin");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../events/MesosSummaryActions");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../NodeSidePanelContents");
jest.dontMock("../../utils/Store");
jest.dontMock("../TaskTable");
jest.dontMock("../TaskView");
jest.dontMock("../RequestErrorMsg");
jest.dontMock("../../utils/Util");
jest.dontMock("../../utils/JestUtil");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var JestUtil = require("../../utils/JestUtil");
var MesosStateStore = require("../../stores/MesosStateStore");
var MesosSummaryActions = require("../../events/MesosSummaryActions");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var NodeSidePanelContents = require("../NodeSidePanelContents");

describe("NodeSidePanelContents", function () {
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
        return {
          version: "1"
        };
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
    MesosSummaryStore.processSummary({
      slaves: [
        {
          "id": "foo",
          "hostname": "bar"
        },
        {
          id: "existingNode",
          version: "10",
          active: true,
          registered_time: 10,
          sumTaskTypesByState: function () { return 1; }
        }
      ]
    });
  });

  afterEach(function () {
    MesosSummaryActions.fetchSummary = this.fetchSummary;
    MesosStateStore.getTasksFromNodeID = this.getTasksFromNodeID;
    MesosStateStore.get = this.storeGet;
    MesosStateStore.getNodeFromID = this.storeGetNode;
  });

  describe("#renderDetailsTabView", function () {

    it("should return null if node does not exist", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="nonExistent" />
      );

      var result = instance.renderDetailsTabView();
      expect(result).toEqual(null);
    });

    it("should return a node if node exists", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="existingNode" />
      );

      var result = instance.renderDetailsTabView();
      expect(TestUtils.isElement(result)).toEqual(true);
    });
  });

  describe("#getKeyValuePairs", function () {

    it("should return an empty set if node does not exist", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="nonExistent" />
      );

      var result = instance.getKeyValuePairs({});
      expect(result).toEqual(null);
    });

    it("should return null if undefined is passed", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="nonExistent" />
      );

      var result = instance.getKeyValuePairs();
      expect(result).toEqual(null);
    });

    it("should return a node of elements if node exists", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="existingNode" />
      );

      var result = instance.getKeyValuePairs({"foo": "bar"});
      expect(TestUtils.isElement(result)).toEqual(true);
    });

    it("should return a headline if headline string is given", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="existingNode" />
      );

      let headline = JestUtil.renderAndFindTag(
        instance.getKeyValuePairs({"foo": "bar"}, "baz"),
        "h3"
      );

      expect(TestUtils.isDOMComponent(headline)).toEqual(true);
    });
  });

  describe("#render", function () {
    it("should show error if node is not to be found", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="nonExistent" />
      );

      let headline = JestUtil.renderAndFindTag(
        instance.render(),
        "h3"
      );

      expect(headline.getDOMNode().textContent).toBe("Error finding node");
    });

    it("should show the nodes hostname if it is found", function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="foo" />
      );
      let contents = TestUtils.renderIntoDocument(instance.render());
      let headline = TestUtils.findRenderedDOMComponentWithClass(
        contents, "side-panel-content-header-label"
      );

      expect(headline.getDOMNode().textContent).toBe("bar");
    });
  });
});
