jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/ACLStore");
jest.dontMock("../../structs/ACLList");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../PermissionsView");

require("../../utils/StoreMixinConfig");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ACLList = require("../../structs/ACLList");
var ACLStore = require("../../stores/ACLStore");
var PermissionsView = require("../PermissionsView");

describe("PermissionsView", function () {

  describe("#handleResourceSelection", function () {
    beforeEach(function () {
      var permissions = new ACLList({items: [
        {
          rid: "foo",
          description: "foo description"
        },
        {
          rid: "bar",
          description: "bar description"
        }
      ]});

      this.instance = TestUtils.renderIntoDocument(
        <PermissionsView
          permissions={permissions.getItems()}
          itemID="quis"
          itemType="user"
          parentRouter={null} />
      );

      this.prevGrantUserActionToResource = ACLStore.grantUserActionToResource;
      ACLStore.grantUserActionToResource = jasmine.createSpy();
    });

    afterEach(function () {
      ACLStore.grantUserActionToResource = this.prevGrantUserActionToResource;
    });

    it("calls #grantUserActionToResource with an id", function () {
      this.instance.handleResourceSelection({id: "foo"});

      expect(ACLStore.grantUserActionToResource)
        .toHaveBeenCalledWith("quis", "access", "foo");
    });

    it("shouldn't call #grantUserActionToResource when is default", function () {
      this.instance.handleResourceSelection({id: "DEFAULT"});

      expect(ACLStore.grantUserActionToResource).not.toHaveBeenCalled();
    });
  });

});
