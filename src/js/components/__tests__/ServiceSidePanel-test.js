jest.dontMock("../ServiceSidePanel");
jest.dontMock("../../utils/Store");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MarathonStore = require("../../stores/MarathonStore");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var MesosStateStore = require("../../stores/MesosStateStore");
var ServiceSidePanel = require("../ServiceSidePanel");

describe("ServiceSidePanel", function () {
  beforeEach(function () {
    this.summaryGetServiceFromName = MesosSummaryStore.getServiceFromName;
    this.marathonGetServiceFromName = MarathonStore.getServiceFromName;
    this.stateGetServiceFromName = MesosStateStore.getServiceFromName;
    this.getServiceHealth = MarathonStore.getServiceHealth;

    function fakeFn(name) {
      if (name === "service_that_exists") {
        return {
          name: "foo",
          registered_time: 1000,
          tasks: [],
          snapshot: {name: "foo", ports: [1, 2]}
        };
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

  describe("callback functionality", function () {
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

  describe("getting info", function () {

    describe("#getInfo", function () {
      it("should return null if service doesn't exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanel
            open={false}
            serviceName="service_that_does_not_exist"/>
        );

        var info = instance.getInfo();
        expect(info).toEqual(null);
      });

      it("should return an element if service does exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanel
            open={false}
            serviceName="service_that_exists"/>
        );

        var info = instance.getInfo();
        expect(TestUtils.isElement(info[0])).toEqual(true);
      });
    });

    describe("#getBasicInfo", function () {
      it("should return null if service doesn't exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanel
            open={false}
            serviceName="service_that_does_not_exist"/>
        );

        var info = instance.getBasicInfo();
        expect(info).toEqual(null);
      });

      it("should return an element if service does exist", function () {
        var instance = TestUtils.renderIntoDocument(
          <ServiceSidePanel
            open={false}
            serviceName="service_that_exists"/>
        );

        var info = instance.getBasicInfo();
        expect(TestUtils.isElement(info)).toEqual(true);
      });
    });
  });

});
