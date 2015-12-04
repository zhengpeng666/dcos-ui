jest.autoMockOff();

jest.dontMock("../RequestErrorMsg");
jest.dontMock("../SidePanelContents");
jest.dontMock("../UserGroupTable");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../events/ACLUsersActions");
jest.dontMock("../../events/MesosSummaryActions");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../mixins/StoreMixin");
jest.dontMock("../../mixins/TabsMixin");
jest.dontMock("../../stores/ACLUserStore");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../structs/GroupsList");
jest.dontMock("../../structs/User");
jest.dontMock("../../utils/JestUtil");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/Util");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ACLUserStore = require("../../stores/ACLUserStore");
var JestUtil = require("../../utils/JestUtil");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var EventTypes = require("../../constants/EventTypes");
var UserGroupTable = require("../UserGroupTable");
var User = require("../../structs/User");
const userDetailsFixture =
  require("../../../../tests/_fixtures/acl/user-with-details.json");

describe("UserGroupTable", function () {

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

    beforeEach(function () {
      var userID = "unicode";
      this.instance = TestUtils.renderIntoDocument(
        <UserGroupTable userID={userID}/>
      );
      this.groupsTbody = TestUtils.findRenderedDOMComponentWithTag(
        this.instance,
        "tbody"
      );
      this.groupRows = TestUtils.scryRenderedDOMComponentsWithTag(
        this.groupsTbody,
        "tr"
      );
    });

    it("should render a table with two groups", function () {
      expect(this.groupRows.length).toEqual(2);
    });

    it("should render one remove button for each row", function () {
      this.groupRows.forEach(function (row) {
        var removeButton = TestUtils.scryRenderedDOMComponentsWithClass(
          row,
          "button-danger"
        );
        expect(removeButton.length).toEqual(1);
      });
    });

  });

});
