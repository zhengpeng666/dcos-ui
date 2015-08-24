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

    it("gets list of services", function () {
      var services = [
        {name: "foo", health: {key: "bar"}}
      ];
      var list = this.instance.getServicesList(services);
      expect(list).toEqual([{name: "foo", health: {key: "bar"}}]);
    });

    it("should pick out name,health keys only", function () {
      var services = [
        {name: "foo", health: {key: "bar"}, bar: "baz"}
      ];
      var list = this.instance.getServicesList(services);
      expect(list).toEqual([{name: "foo", health: {key: "bar"}}]);
    });

    it("handles services with missing health", function () {
      var services = [
        {name: "foo"}
      ];
      var list = this.instance.getServicesList(services);
      expect(list).toEqual([{name: "foo"}]);
    });

    it("sorts services by health", function () {
      var services = [
        {name: "bar", health: {key: "HEALTHY"}},
        {name: "foo", health: {key: "UNHEALTHY"}}
      ];
      var list = this.instance.getServicesList(services);
      expect(list[0].name).toEqual("foo");
      expect(list[1].name).toEqual("bar");
    });

  });

});
