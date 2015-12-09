jest.dontMock("../UserGroupMembershipTab");
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

var ACLGroupStore = require("../../stores/ACLGroupStore");
var ACLGroupsStore = require("../../stores/ACLGroupsStore");
var ACLUserStore = require("../../stores/ACLUserStore");
var UserGroupMembershipTab = require("../UserGroupMembershipTab");
var User = require("../../structs/User");

const userDetailsFixture =
  require("../../../../tests/_fixtures/acl/user-with-details.json");

describe("UserGroupMembershipTab", function () {

  beforeEach(function () {
    this.userStoreGetUser = ACLUserStore.getUser;

    ACLUserStore.getUser = function (userID) {
      if (userID === "unicode") {
        return new User(userDetailsFixture);
      }
    };

    this.instance = TestUtils.renderIntoDocument(
      <UserGroupMembershipTab userID={"unicode"}/>
    );

    this.instance.handleOpenConfirm = jest.genMockFunction();
  });

  afterEach(function () {
    ACLUserStore.getUser = this.userStoreGetUser;
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
                  gid: "bar"
                },
                {
                  description: "bar",
                  gid: "baz"
                },
                {
                  description: "baz",
                  gid: "qux"
                }
              ];
            }
          };
        }
      };

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
