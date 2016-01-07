jest.dontMock("../ServerErrorModal");
jest.dontMock("../../utils/Util");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../stores/ACLAuthStore");
jest.dontMock("../../stores/ACLGroupsStore");
jest.dontMock("../../stores/ACLGroupStore");
jest.dontMock("../../stores/ACLStore");
jest.dontMock("../../stores/ACLUsersStore");
jest.dontMock("../../stores/ACLUserStore");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../stores/MarathonStore");
jest.dontMock("../../stores/MesosStateStore");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../events/ACLAuthActions");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../utils/Store");

require("../../utils/StoreMixinConfig");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ServerErrorModal = require("../ServerErrorModal");

describe("ServerErrorModal", function () {
  beforeEach(function () {
    this.instance = TestUtils.renderIntoDocument(
      <ServerErrorModal />
    );
  });

  describe("#handleModalClose", function () {
    beforeEach(function () {
      this.instance.handleModalClose();
    });

    it("closes the modal", function () {
      expect(this.instance.state.isOpen).toEqual(false);
    });

    it("resets the error array", function () {
      expect(this.instance.state.errors).toEqual([]);
    });
  });

  describe("#getContent", function () {
    it("should return the same number of children as errors", function () {
      this.instance.state.errors = [1, 2, 3];
      var contents = this.instance.getContent();
      var result = contents._store.props.children;

      expect(result.length).toEqual(3);
    });
  });
});
