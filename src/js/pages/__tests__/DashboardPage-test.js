jest.dontMock("../DashboardPage");
jest.dontMock("../../stores/MarathonStore");
jest.dontMock("./fixtures/MockMarathonResponse");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../utils/Util");
jest.dontMock("../../constants/HealthSorting");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var DashboardPage = require("../DashboardPage");
var MarathonStore = require("../../stores/MarathonStore");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var MockMarathonResponse = require("./fixtures/MockMarathonResponse");
var ServicesList = require("../../structs/ServicesList");
var SummaryList = require("../../structs/SummaryList");

MesosSummaryStore.get = function (key) {
  if (key === "states") {
    let list = new SummaryList();
    list.addSnapshot({frameworks: []}, Date.now());
    return list;
  }
};

describe("DashboardPage", function () {

  describe("#getServicesList", function () {

    beforeEach(function () {
      MarathonStore.addChangeListener = function () {};
      this.instance = TestUtils.renderIntoDocument(
        <DashboardPage servicesListLength={5} params={{serviceName: ""}} />
      );
    });

    it("gets list of services", function () {
      let services = new ServicesList({items: [
        {name: "foo", health: {key: "bar"}}
      ]});
      let list = this.instance.getServicesList(services.getItems());
      expect(list).toEqual([{name: "foo"}]);
    });

    it("picks out [name, webui_url, TASK_RUNNING, id] keys only", function () {
      let services = new ServicesList({items: [{
        name: "foo",
        health: {key: "bar"},
        webui_url: "qux",
        TASK_RUNNING: "baz",
        id: "quux",
        corge: "grault"
      }]});

      let list = this.instance.getServicesList(services.getItems());

      expect(list).toEqual([{
        name: "foo",
        webui_url: "qux",
        TASK_RUNNING: "baz",
        id: "quux"
      }]);
    });

    it("handles services with missing health", function () {
      let services = new ServicesList({items: [{name: "foo"}]});
      let list = this.instance.getServicesList(services.getItems());
      expect(list).toEqual([{name: "foo"}]);
    });

    it("should not return more services than servicesListLength", function () {
      let services = new ServicesList({items: [
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}}
      ]});
      let list = this.instance.getServicesList(services.getItems());
      expect(list.length).toEqual(5);
    });

    it("should sort by health", function () {
      MarathonStore.processMarathonApps(MockMarathonResponse);

      let services = new ServicesList({items: [
        {name: "IdleFramework"},
        {name: "UnhealthyFramework"},
        {name: "HealthyFramework"},
        {name: "NAFramework"}
      ]});
      let list = this.instance.getServicesList(services.getItems());

      expect(list[0].name).toEqual("UnhealthyFramework");
      expect(list[1].name).toEqual("HealthyFramework");
      expect(list[2].name).toEqual("IdleFramework");
      expect(list[3].name).toEqual("NAFramework");
    });

  });

});
