jest.dontMock("../GroupUserMembershipTab");
jest.dontMock("../GroupUserTable");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../events/ACLUsersActions");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../mixins/StoreMixin");
jest.dontMock("../../stores/ACLGroupStore");
jest.dontMock("../../utils/ResourceTableUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/Util");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ACLGroupStore = require("../../stores/ACLGroupStore");
var ACLGroupsStore = require("../../stores/ACLGroupsStore");
var ACLUsersStore = require("../../stores/ACLUsersStore");
var GroupUserMembershipTab = require("../GroupUserMembershipTab");
var Group = require("../../structs/Group");

const groupDetailsFixture =
  require("../../../../tests/_fixtures/acl/group-with-details.json");

describe("GroupUserMembershipTab", function () {

  beforeEach(function () {
    this.groupStoreGetGroup = ACLGroupStore.getGroup;

    ACLGroupStore.getGroup = function (groupID) {
      if (groupID === "unicode") {
        return new Group(groupDetailsFixture);
      }
    };

    this.instance = TestUtils.renderIntoDocument(
      <GroupUserMembershipTab groupID={"unicode"}/>
    );

    this.instance.handleOpenConfirm = jest.genMockFunction();
  });

  afterEach(function () {
    ACLGroupStore.getGroup = this.groupStoreGetGroup;
  });

  describe("add users dropdown", function () {

    beforeEach(function () {
      this.usersStoreGet = ACLUsersStore.get;
      this.groupStoreAddUser = ACLGroupStore.addUser;

      ACLGroupStore.addUser = jest.genMockFunction();
      ACLUsersStore.get = function (key) {
        if (key === "users") {
          return {
            getItems: function () {
              return [
                {
                  description: "foo",
                  uid: "bar"
                },
                {
                  description: "bar",
                  uid: "baz"
                },
                {
                  description: "baz",
                  uid: "qux"
                }
              ];
            }
          };
        }
      };

      this.instance.setState({requestUsersSuccess: true});

      this.instance.dropdownButton = TestUtils
        .scryRenderedDOMComponentsWithClass(this.instance, "dropdown-toggle");

      TestUtils.Simulate.click(this.instance.dropdownButton[0].getDOMNode());

      this.instance.selectableElements = TestUtils
        .scryRenderedDOMComponentsWithClass(this.instance, "is-selectable");
      TestUtils.Simulate.click(this.instance.selectableElements[1]
        .getDOMNode());
    });

    afterEach(function () {
      ACLGroupsStore.get = this.usersStoreGet;
      ACLGroupStore.addUser = this.groupStoreAddUser;
    });

    it("should call the handler when selecting a user", function () {
      expect(ACLGroupStore.addUser.mock.calls.length).toEqual(1);
    });

    it("should call #addUser with the proper arguments when selecting a user",
      function () {
      expect(ACLGroupStore.addUser.mock.calls[0][0]).toEqual("unicode");
      expect(ACLGroupStore.addUser.mock.calls[0][1]).toEqual("bar");
    });

  });

});
