jest.dontMock("../DetailSidePanel");
jest.dontMock("../ServiceSidePanel");
jest.dontMock("../../events/MesosSummaryActions");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../utils/JestUtil");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var JestUtil = require("../../utils/JestUtil");
var MarathonStore = require("../../stores/MarathonStore");
var MesosSummaryActions = require("../../events/MesosSummaryActions");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var MesosStateStore = require("../../stores/MesosStateStore");
var Service = require("../../structs/Service");
var ServiceSidePanel = require("../ServiceSidePanel");

MesosSummaryActions.fetchSummary = function () {};
MesosSummaryStore.init();

describe("ServiceSidePanel", function () {
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

    describe("#renderDetailsTabView", function () {
      it("should return 'no info' if service doesn't exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanel
            open={false}
            itemID="service_that_does_not_exist"/>
        );

        var info = JestUtil.renderAndFindTag(instance.renderDetailsTabView(), "h2");
        expect(info.getDOMNode().textContent)
          .toEqual("No information available.");
      });

      it("should return an element if service does exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanel
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
          <ServiceSidePanel
            open={false}
            itemID="service_that_does_not_exist"/>
        );

        var info = instance.getBasicInfo();
        expect(info).toEqual(null);
      });

      it("should return an element if service does exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanel
            open={false}
            itemID="service_that_exists"/>
        );

        var info = instance.getBasicInfo();
        expect(TestUtils.isElement(info)).toEqual(true);
      });
    });
  });

});
