jest.dontMock("../DashboardPage");
jest.dontMock("../../stores/MarathonStore");
jest.dontMock("./fixtures/MockMarathonResponse");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../utils/Store");
jest.dontMock("../../constants/HealthSorting");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var DashboardPage = require("../DashboardPage");
var MarathonStore = require("../../stores/MarathonStore");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var MockMarathonResponse = require("./fixtures/MockMarathonResponse");

MesosSummaryStore.getLatest = function () {
  return {frameworks: []};
};

describe("DashboardPage", function () {

  describe("#getServicesList", function () {

    beforeEach(function () {
      MarathonStore.addChangeListener = function () {};
      this.instance = TestUtils.renderIntoDocument(
        <DashboardPage servicesListLength={5}/>
      );
    });

    it("gets list of services", function () {
      var services = [
        {name: "foo", health: {key: "bar"}}
      ];
      var list = this.instance.getServicesList(services);
      expect(list).toEqual([{name: "foo"}]);
    });

    it("should pick out name, webui_url," +
      "TASK_RUNNING, and id keys only", function () {
      var services = [{
        name: "foo",
        health: {key: "bar"},
        webui_url: "qux",
        TASK_RUNNING: "baz",
        id: "quux",
        corge: "grault"
      }];

      var list = this.instance.getServicesList(services);

      expect(list).toEqual([{
        name: "foo",
        webui_url: "qux",
        TASK_RUNNING: "baz",
        id: "quux"
      }]);
    });

    it("handles services with missing health", function () {
      var services = [
        {name: "foo"}
      ];
      var list = this.instance.getServicesList(services);
      expect(list).toEqual([{name: "foo"}]);
    });

    it("should not return more services than servicesListLength", function () {
      var services = [
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}}
      ];
      var list = this.instance.getServicesList(services);
      expect(list.length).toEqual(5);
    });

    it("should sort by health", function () {
      MarathonStore.processMarathonApps(MockMarathonResponse);

      var servicesList = [
        {name: "IdleFramework"},
        {name: "UnhealthyFramework"},
        {name: "HealthyFramework"},
        {name: "NAFramework"}
      ];
      var list = this.instance.getServicesList(servicesList);

      expect(list[0].name).toEqual("UnhealthyFramework");
      expect(list[1].name).toEqual("HealthyFramework");
      expect(list[2].name).toEqual("IdleFramework");
      expect(list[3].name).toEqual("NAFramework");
    });

  });

});
