jest.dontMock("../GroupUserTable");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../events/ACLUsersActions");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../stores/ACLGroupStore");
jest.dontMock("../../utils/ResourceTableUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/Util");

require("../../utils/StoreMixinConfig");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ActionTypes = require("../../constants/ActionTypes");
var ACLGroupStore = require("../../stores/ACLGroupStore");
var AppDispatcher = require("../../events/AppDispatcher");
var GroupUserTable = require("../GroupUserTable");
var Group = require("../../structs/Group");

const groupDetailsFixture =
  require("../../../../tests/_fixtures/acl/group-with-details.json");
groupDetailsFixture.permissions = groupDetailsFixture.permissions.array;
groupDetailsFixture.users = groupDetailsFixture.users.array;

describe("GroupUserTable", function () {

  beforeEach(function () {
    this.groupStoreGetGroup = ACLGroupStore.getGroup;

    ACLGroupStore.getGroup = function (groupID) {
      if (groupID === "unicode") {
        return new Group(groupDetailsFixture);
      }
    };

    this.instance = TestUtils.renderIntoDocument(
      <GroupUserTable groupID={"unicode"}/>
    );

    this.instance.handleOpenConfirm = jest.genMockFunction();
  });

  afterEach(function () {
    ACLGroupStore.getGroup = this.groupStoreGetGroup;
  });

  describe("#onGroupStoreDeleteUserError", function () {

    it.only("updates state when an error event is emitted", function () {
      ACLGroupStore.deleteUser = function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_ERROR,
          data: "foo bar",
          groupID: "baz",
          userID: "unicode"
        });
      };

      ACLGroupStore.deleteUser("foo", "unicode");
      expect(this.instance.state.groupUpdateError).toEqual("foo bar");
    });

  });

  describe("#onGroupStoreDeleteUserSuccess", function () {

    it("gets called when a success event is emitted", function () {
      ACLGroupStore.deleteUser = function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS,
          data: "foo bar",
          groupID: "baz",
          userID: "unicode"
        });
      };
      this.instance.onGroupStoreDeleteUserSuccess = jest.genMockFunction();

      ACLGroupStore.deleteUser("foo", "unicode");
      expect(this.instance.onGroupStoreDeleteUserSuccess.mock.calls.length)
        .toEqual(1);
    });

  });

  describe("#getConfirmModalContent", function () {

    beforeEach(function () {
      this.instance.state.userID = "bar";
    });

    it("returns a message containing the group's name and user's name",
      function () {
      this.instance.modalContent = this.instance.getConfirmModalContent({
        description: "foo", users: [{user: {uid: "bar", description: "qux"}}]
      });

      var paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(
        TestUtils.renderIntoDocument(this.instance.modalContent),
        "p"
      );
      expect(paragraphs[0].props.children)
        .toEqual("qux will be removed from the foo group.");
    });

    it("returns a message containing the error that was received",
      function () {
      this.instance.state.groupUpdateError = "quux";
      this.instance.modalContent = this.instance.getConfirmModalContent({
        description: "foo", users: [{user: {uid: "bar", description: "qux"}}]
      });
      var paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(
        TestUtils.renderIntoDocument(this.instance.modalContent),
        "p"
      );

      expect(paragraphs[1].props.children)
        .toEqual("quux");
    });

  });

  describe("#renderUserLabel", function () {

    it("returns the specified property from the object", function () {
      var label = this.instance.renderUserLabel("foo", {foo: "bar"});
      expect(label).toEqual("bar");
    });

  });

  describe("#renderButton", function () {

    it("calls handleOpenConfirm with the proper arguments", function () {
      var buttonWrapper = TestUtils.renderIntoDocument(
        this.instance.renderButton("foo", {uid: "bar"})
      );
      var button = TestUtils.scryRenderedDOMComponentsWithClass(
        buttonWrapper,
        "button"
      )[0].getDOMNode();

      TestUtils.Simulate.click(button);

      expect(this.instance.handleOpenConfirm.mock.calls[0][0]).toEqual(
        {uid: "bar"}
      );
    });

  });

});
