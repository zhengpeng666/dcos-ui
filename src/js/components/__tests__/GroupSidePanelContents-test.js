jest.dontMock("../SidePanelContents");
jest.dontMock("../GroupSidePanelContents");
jest.dontMock("../../events/MesosSummaryActions");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../events/ACLGroupsActions");
jest.dontMock("../../stores/ACLGroupStore");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../FieldInput");
jest.dontMock("../../constants/FieldTypes");
jest.dontMock("../Form");
jest.dontMock("../FormControl");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../icons/IconEdit");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../mixins/TabsMixin");
jest.dontMock("../RequestErrorMsg");
jest.dontMock("../../utils/JestUtil");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/Util");
jest.dontMock("../../structs/Group");

require("../../utils/StoreMixinConfig");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ACLGroupStore = require("../../stores/ACLGroupStore");
var JestUtil = require("../../utils/JestUtil");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var EventTypes = require("../../constants/EventTypes");
var GroupSidePanelContents = require("../GroupSidePanelContents");
var Group = require("../../structs/Group");

var groupDetailsFixture =
  require("../../../../tests/_fixtures/acl/group-with-details.json");
groupDetailsFixture.permissions = groupDetailsFixture.permissions.array;
groupDetailsFixture.users = groupDetailsFixture.users.array;

describe("GroupSidePanelContents", function () {

  beforeEach(function () {
    this.summaryGet = MesosSummaryStore.get;
    this.groupStoreGetGroup = ACLGroupStore.getGroup;

    MesosSummaryStore.get = function (status) {
      if (status === "statesProcessed") {
        return true;
      }
    };

    ACLGroupStore.getGroup = function (groupID) {
      if (groupID === "unicode") {
        return new Group(groupDetailsFixture);
      }
    };
  });

  afterEach(function () {
    MesosSummaryStore.get = this.summaryGet;
    ACLGroupStore.getGroup = this.groupStoreGetGroup;
  });

  describe("#render", function () {

    it("should return error message if fetch error was received", function () {
      var groupID = "unicode";

      var instance = TestUtils.renderIntoDocument(
        <GroupSidePanelContents
          itemID={groupID}/>
      );

      ACLGroupStore.emit(EventTypes.ACL_GROUP_DETAILS_FETCHED_ERROR, groupID);

      var text = JestUtil.renderAndFindTag(instance.render(), "h3");
      expect(text.getDOMNode().textContent)
        .toEqual("Cannot Connect With The Server");
    });

    it("should show loading screen if still waiting on Store", function () {
      MesosSummaryStore.get = function (status) {
        if (status === "statesProcessed") {
          return false;
        }
      };
      var groupID = "unicode";

      var instance = TestUtils.renderIntoDocument(
        <GroupSidePanelContents
          itemID={groupID}/>
      );

      var loading = TestUtils.scryRenderedDOMComponentsWithClass(
        instance.render(),
        "ball-scale"
      );

      expect(loading).toEqual({});
    });

    it("should not return error message or loading screen if group is found",
      function () {
        var groupID = "unicode";

        var instance = TestUtils.renderIntoDocument(
          <GroupSidePanelContents
            itemID={groupID}/>
        );

        var text = TestUtils.findRenderedDOMComponentWithClass(
          instance,
          "form-element-inline-text"
        );

        expect(text.getDOMNode().textContent).toEqual("藍-遙 遥 悠 遼 Größe");
      }
    );

  });
});
