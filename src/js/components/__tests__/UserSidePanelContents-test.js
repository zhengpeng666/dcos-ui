jest.dontMock("../SidePanelContents");
jest.dontMock("../UserSidePanelContents");
jest.dontMock("../../events/MesosSummaryActions");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../events/ACLUsersActions");
jest.dontMock("../../stores/ACLUserStore");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../mixins/StoreMixin");
jest.dontMock("../../mixins/TabsMixin");
jest.dontMock("../RequestErrorMsg");
jest.dontMock("../../utils/JestUtil");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");
jest.dontMock("../../structs/User");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ACLUserStore = require("../../stores/ACLUserStore");
var JestUtil = require("../../utils/JestUtil");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var EventTypes = require("../../constants/EventTypes");
var UserSidePanelContents = require("../UserSidePanelContents");
var User = require("../../structs/User");

var userDetailsFixture =
  require("../../../../tests/_fixtures/acl/user-with-details.json");

describe("UserSidePanelContents", function () {

  beforeEach(function () {
    this.summaryGet = MesosSummaryStore.get;
    this.userStoreGetUser = ACLUserStore.getUser;

    MesosSummaryStore.get = function (status) {
      if (status === "statesProcessed") {
        return true;
      }
    };

    ACLUserStore.getUser = function (userID) {
      if (userID === "unicode") {
        return new User(userDetailsFixture);
      }
    };
  });

  afterEach(function () {
    MesosSummaryStore.get = this.summaryGet;
    ACLUserStore.getUser = this.userStoreGetUser;
  });

  describe("#render", function () {

    it("should return error message if fetch error was received", function () {
      var userID = "unicode";

      var instance = TestUtils.renderIntoDocument(
        <UserSidePanelContents
          itemID={userID}/>
      );

      ACLUserStore.emit(EventTypes.ACL_USER_DETAILS_FETCHED_ERROR, userID);

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
      var userID = "unicode";

      var instance = TestUtils.renderIntoDocument(
        <UserSidePanelContents
          itemID={userID}/>
      );

      var loading = TestUtils.scryRenderedDOMComponentsWithClass(
        instance.render(),
        "ball-scale"
      );

      expect(loading).toEqual({});
    });

    it("should not return error message or loading screen if user is found",
      function () {
        var userID = "unicode";

        var instance = TestUtils.renderIntoDocument(
          <UserSidePanelContents
            itemID={userID}/>
        );

        var text = JestUtil.renderAndFindTag(instance.render(), "h1");
        expect(text.getDOMNode().textContent).toEqual("藍-Schüler Zimmer verfügt über einen Schreibtisch, Telefon, Safe in Notebook-Größe");
      }
    );

  });
});
