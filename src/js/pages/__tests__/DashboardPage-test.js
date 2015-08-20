jest.dontMock("../DashboardPage");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../utils/Store");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var DashboardPage = require("../DashboardPage");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");

MesosSummaryStore.getLatest = function () {
  return {frameworks: []};
};

describe("DashboardPage", function () {

  describe("#getComputedWidth", function () {

    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <DashboardPage />
      );
    });

    it("should pick out name,health keys only", function () {
      var services = [
        {name: "foo", health: {key: "bar"}, bar: "baz"}
      ];
      var list = this.instance.getServicesList(services);
      expect(list).toEqual([{name: "foo", health: {key: "bar"}}]);
    });

  });

});
