jest.dontMock("../SidePanels");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../mixins/TabsMixin");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/ACLUserStore");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../stores/MesosStateStore");
jest.dontMock("../../stores/MarathonStore");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../events/MesosSummaryActions");
jest.dontMock("../../events/MarathonActions");
jest.dontMock("../SidePanelContents");
jest.dontMock("../GroupSidePanelContents");
jest.dontMock("../NodeSidePanelContents");
jest.dontMock("../ServiceSidePanelContents");
jest.dontMock("../TaskSidePanelContents");
jest.dontMock("../UserSidePanelContents");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../../structs/SummaryList");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosSummaryActions = require("../../events/MesosSummaryActions");
var ACLUserStore = require("../../stores/ACLUserStore");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var NodeSidePanelContents = require("../NodeSidePanelContents");
var GroupSidePanelContents = require("../GroupSidePanelContents");
var TaskSidePanelContents = require("../TaskSidePanelContents");
var ServiceSidePanelContents = require("../ServiceSidePanelContents");
var UserSidePanelContents = require("../UserSidePanelContents");
var SidePanels = require("../SidePanels");

describe("SidePanels", function () {
  beforeEach(function () {
    this.fetchSummary = MesosSummaryActions.fetchSummary;
    this.userStore = ACLUserStore.getUser;

    MesosSummaryActions.fetchSummary = function () {
      return null;
    };

    MesosSummaryStore.get = function () {
      return true;
    };

    ACLUserStore.getUser = function () {
      return {
        "uid": "user",
        "url": "/users/user",
        "description": "user description"
      };
    };

    MesosSummaryStore.init();
  });

  afterEach(function () {
    MesosSummaryActions.fetchSummary = this.fetchSummary;
    ACLUserStore.getUser = this.userStore;
  });

  describe("#isOpen", function () {
    beforeEach(function () {
      this.params = {
        nodeID: null,
        serviceName: null,
        taskID: null,
        userID: null,
        groupID: null
      };
      this.instance = TestUtils.renderIntoDocument(
        <SidePanels
          statesProcessed={true}
          params={this.params} />
      );
    });

    it("should return false if all IDs are null", function () {
      expect(this.instance.isOpen()).toEqual(false);
    });

    it("should return true if one value is set", function () {
      var prevServiceName = this.params.serviceName;
      this.params.serviceName = "serviceName";
      expect(this.instance.isOpen()).toEqual(true);
      this.params.serviceName = prevServiceName;
    });
  });

  describe("#getContents", function () {
    beforeEach(function () {
      this.params = {
        nodeID: null,
        serviceName: null,
        taskID: null,
        userID: null,
        groupID: null
      };
      this.instance = TestUtils.renderIntoDocument(
        <SidePanels
          statesProcessed={true}
          params={this.params} />
      );
    });

    it("should return null if all IDs are null", function () {
      expect(this.instance.getContents(this.params)).toEqual(null);
    });

    it("should return NodeSidePanelContents if nodeID is set", function () {
      this.params.nodeID = "set";
      var contents = this.instance.getContents(this.params);

      expect(contents.type === NodeSidePanelContents).toEqual(true);
      this.params.nodeID = null;
    });

    it("should return TaskSidePanelContents if taskID is set", function () {
      this.params.taskID = "set";
      var contents = this.instance.getContents(this.params);

      expect(contents.type === TaskSidePanelContents).toEqual(true);
      this.params.taskID = null;
    });

    it("should return ServiceSidePanelContents if serviceName is set",
      function () {
      this.params.serviceName = "set";
      var contents = this.instance.getContents(this.params);

      expect(contents.type === ServiceSidePanelContents).toEqual(true);
      this.params.serviceName = null;
    });

    it("should return UserSidePanelContents if userID is set",
      function () {
      this.params.userID = "set";
      var contents = this.instance.getContents(this.params);

      expect(contents.type === UserSidePanelContents).toEqual(true);
      this.params.serviceName = null;
    });

    it("should return GroupSidePanelContents if groupID is set",
      function () {
      this.params.groupID = "set";
      var contents = this.instance.getContents(this.params);

      expect(contents.type === GroupSidePanelContents).toEqual(true);
      this.params.serviceName = null;
    });
  });
});
