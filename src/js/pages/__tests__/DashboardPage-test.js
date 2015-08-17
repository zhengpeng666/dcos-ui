jest.dontMock("../DashboardPage");
jest.dontMock("../../mixins/GetSetInternalStorageMixin");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../utils/Store");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var DashboardPage = require("../DashboardPage");
var MesosStateStore = require("../../stores/MesosStateStore");

MesosStateStore.getLatest = function () {
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
