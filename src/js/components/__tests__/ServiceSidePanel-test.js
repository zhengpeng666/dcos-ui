jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../config/Config");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../ServiceSidePanel");
jest.dontMock("../../structs/SummaryList");
jest.dontMock("../../structs/StateSummary");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/StringUtil");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var ServiceSidePanel = require("../ServiceSidePanel");

MesosSummaryStore.getServiceFromName = function () {
  return {name: "foo"};
};

describe("ServiceSidePanel", function () {

  beforeEach(function () {
    this.callback = jasmine.createSpy();
    this.instance = TestUtils.renderIntoDocument(
      <ServiceSidePanel open={false} onClose={this.callback} />
    );
  });

  it("shouldn't call the callback after initialization", function () {
    expect(this.callback).not.toHaveBeenCalled();
  });

  it("should call the callback when the panel close is called", function () {
    this.instance.handlePanelClose();
    expect(this.callback).toHaveBeenCalled();
  });
});
