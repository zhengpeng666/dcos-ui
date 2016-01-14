jest.dontMock("../SidePanelContents");
jest.dontMock("../ServiceSidePanelContents");
jest.dontMock("../../events/MesosSummaryActions");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../utils/JestUtil");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/Util");

require("../../utils/StoreMixinConfig");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var JestUtil = require("../../utils/JestUtil");
var MarathonStore = require("../../stores/MarathonStore");
var MesosSummaryActions = require("../../events/MesosSummaryActions");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var MesosStateStore = require("../../stores/MesosStateStore");
var Service = require("../../structs/Service");
var ServiceSidePanelContents = require("../ServiceSidePanelContents");

MesosSummaryActions.fetchSummary = function () {};
MesosSummaryStore.init();

describe("ServiceSidePanelContents", function () {
  beforeEach(function () {
    this.summaryGetServiceFromName = MesosSummaryStore.getServiceFromName;
    this.marathonGetServiceFromName = MarathonStore.getServiceFromName;
    this.stateGetServiceFromName = MesosStateStore.getServiceFromName;
    this.getServiceHealth = MarathonStore.getServiceHealth;

    function fakeFn(name) {
      if (name === "service_that_exists") {
        return new Service({
          name: "foo",
          registered_time: 1000,
          tasks: [],
          snapshot: {name: "foo", ports: [1, 2]}
        });
      }

      return null;
    }
    MesosSummaryStore.getServiceFromName = fakeFn;
    MesosStateStore.getServiceFromName = fakeFn;
    MarathonStore.getServiceFromName = fakeFn;

    MarathonStore.getServiceHealth = function () {
      return {
        key: "HEALTHY",
        value: 1,
        classNames: "text-success"
      };
    };
  });

  afterEach(function () {
    MesosSummaryStore.getServiceFromName = this.summaryGetServiceFromName;
    MesosStateStore.getServiceFromName = this.stateGetServiceFromName;
    MarathonStore.getServiceFromName = this.marathonGetServiceFromName;
    MarathonStore.getServiceHealth = this.getServiceHealth;
  });

  describe("getting info", function () {

    beforeEach(function () {
      this.mesosStateFetSchedulerTaskFromServiceName =
        MesosStateStore.getSchedulerTaskFromServiceName;
      MesosStateStore.getSchedulerTaskFromServiceName =
        jasmine.createSpy("MesosStateStore#getSchedulerTaskFromServiceName");
    });

    beforeEach(function () {
      MesosStateStore.getSchedulerTaskFromServiceName =
        this.mesosStateFetSchedulerTaskFromServiceName;
    });

    describe("#getSchedulerDetails", function () {
      it("should return null if task doesn't exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanelContents
            open={false}
            itemID="service_that_exists"/>
        );

        expect(instance.getSchedulerDetails())
          .toEqual(null);
      });

      it("should return an element if task exists", function () {
        MesosStateStore.getSchedulerTaskFromServiceName =
        jasmine.createSpy("MesosStateStore#getSchedulerTaskFromServiceName")
          .andReturn({id: "foo", resources: {cpus: 0, mem: 0, disk: 0}});
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanelContents
            open={false}
            itemID="service_that_exists"/>
        );

        var info = instance.getSchedulerDetails();
        expect(TestUtils.isElement(info)).toEqual(true);
      });
    });

    describe("#renderDetailsTabView", function () {
      it("should return 'no info' if service doesn't exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanelContents
            open={false}
            itemID="service_that_does_not_exist"/>
        );

        var info = JestUtil.renderAndFindTag(instance.renderDetailsTabView(), "h2");
        expect(info.getDOMNode().textContent)
          .toEqual("No information available.");
      });

      it("should return an element if service does exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanelContents
            open={false}
            itemID="service_that_exists"/>
        );

        var info = instance.renderDetailsTabView();
        expect(TestUtils.isElement(info)).toEqual(true);
      });
    });

    describe("#getBasicInfo", function () {
      it("should return null if service doesn't exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanelContents
            open={false}
            itemID="service_that_does_not_exist"/>
        );

        var info = instance.getBasicInfo();
        expect(info).toEqual(null);
      });

      it("should return an element if service does exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanelContents
            open={false}
            itemID="service_that_exists"/>
        );

        var info = instance.getBasicInfo();
        expect(TestUtils.isElement(info)).toEqual(true);
      });
    });
  });

});
