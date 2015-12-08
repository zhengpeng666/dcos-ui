jest.dontMock("../UserGroupTable");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../events/ACLUsersActions");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../mixins/StoreMixin");
jest.dontMock("../../stores/ACLGroupStore");
jest.dontMock("../../stores/ACLGroupsStore");
jest.dontMock("../../utils/ResourceTableUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/Util");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ActionTypes = require("../../constants/ActionTypes");
var ACLGroupStore = require("../../stores/ACLGroupStore");
var ACLGroupsStore = require("../../stores/ACLGroupsStore");
var ACLUserStore = require("../../stores/ACLUserStore");
var AppDispatcher = require("../../events/AppDispatcher");
var UserGroupTable = require("../UserGroupTable");
var User = require("../../structs/User");

const userDetailsFixture =
  require("../../../../tests/_fixtures/acl/user-with-details.json");

describe("UserGroupTable", function () {

  beforeEach(function () {
    this.userStoreGetUser = ACLUserStore.getUser;

    ACLUserStore.getUser = function (userID) {
      if (userID === "unicode") {
        return new User(userDetailsFixture);
      }
    };

    this.instance = TestUtils.renderIntoDocument(
      <UserGroupTable userID={"unicode"}/>
    );

    this.instance.handleOpenConfirm = jest.genMockFunction();
  });

  afterEach(function () {
    ACLUserStore.getUser = this.userStoreGetUser;
  });

  describe("#onGroupStoreDeleteUserError", function () {

    it("updates state when an error event is emitted", function () {
      ACLGroupStore.deleteUser = function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_ERROR,
          data: "foo bar",
          groupID: "baz",
          userID: "unicode"
        });
      };

      ACLGroupStore.deleteUser("foo", "unicode");
      expect(this.instance.state.userUpdateError).toEqual("foo bar");
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
      this.instance.state.groupID = "bar";
    });

    it("returns a message containing the user's name and group name",
      function () {
      this.instance.modalContent = this.instance.getConfirmModalContent({
        description: "foo", groups: [{group: {gid: "bar", description: "qux"}}]
      });

      var paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(
        TestUtils.renderIntoDocument(this.instance.modalContent),
        "p"
      );
      expect(paragraphs[0].props.children)
        .toEqual("Are you sure you want to remove foo from qux?");
    });

    it("returns a message containing the error that was received",
      function () {
      this.instance.state.userUpdateError = "quux";
      this.instance.modalContent = this.instance.getConfirmModalContent({
        description: "foo", groups: [{group: {gid: "bar", description: "qux"}}]
      });
      var paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(
        TestUtils.renderIntoDocument(this.instance.modalContent),
        "p"
      );
      expect(paragraphs[1].props.children)
        .toEqual("quux");
    });

  });

  describe("#renderGroupLabel", function () {

    it("returns the specified property from the object", function () {
      var label = this.instance.renderGroupLabel("foo", {foo: "bar"});
      expect(label).toEqual("bar");
    });

  });

  describe("#renderButton", function () {

    it("calls handleOpenConfirm with the proper arguments", function () {
      var buttonWrapper = TestUtils.renderIntoDocument(
        this.instance.renderButton("foo", {gid: "bar"})
      );
      var button = TestUtils.scryRenderedDOMComponentsWithClass(
        buttonWrapper,
        "button"
      )[0].getDOMNode();

      TestUtils.Simulate.click(button);

      expect(this.instance.handleOpenConfirm.mock.calls[0][0]).toEqual(
        {gid: "bar"}
      );
    });

  });

  describe("add groups dropdown", function () {

    beforeEach(function () {
      this.groupsStoreGet = ACLGroupsStore.get;
      this.groupStoreAddUser = ACLGroupStore.addUser;

      ACLGroupStore.addUser = jest.genMockFunction();
      ACLGroupsStore.get = function (key) {
        if (key === "groups") {
          return {
            getItems: function () {
              return [
                {
                  description: "foo",
                  gid: "bar",
                },
                {
                  description: "bar",
                  gid: "baz",
                },
                {
                  description: "baz",
                  gid: "qux",
                }
              ];
            }
          }
        }
      }

      this.instance.setState({requestGroupsSuccess: true});

      this.instance.dropdownButton = TestUtils
        .scryRenderedDOMComponentsWithClass(this.instance, "dropdown-toggle");
      TestUtils.Simulate.click(this.instance.dropdownButton[0].getDOMNode());

      this.instance.selectableElements = TestUtils
        .scryRenderedDOMComponentsWithClass(this.instance, "is-selectable");
      TestUtils.Simulate.click(this.instance.selectableElements[1]
        .getDOMNode());
    });

    afterEach(function () {
      ACLGroupsStore.get = this.groupsStoreGet;
      ACLGroupStore.addUser = this.groupStoreAddUser;
    });

    it("should call the handler when selecting a group", function () {
      expect(ACLGroupStore.addUser.mock.calls.length).toEqual(1);
    });

    it("should call #addUser with the proper arguments when selecting a group",
      function () {
      expect(ACLGroupStore.addUser.mock.calls[0][0]).toEqual("bar");
      expect(ACLGroupStore.addUser.mock.calls[0][1]).toEqual("unicode");
    });

  });

});
