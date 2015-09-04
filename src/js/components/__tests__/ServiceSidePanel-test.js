jest.dontMock("../ServiceSidePanel");
jest.dontMock("../../utils/Store");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MarathonStore = require("../../stores/MarathonStore");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");
var MesosStateStore = require("../../stores/MesosStateStore");
var ServiceSidePanel = require("../ServiceSidePanel");

MarathonStore.getServiceHealth = function () {
  return {
    key: "HEALTHY",
    value: 1,
    classNames: "text-success"
  };
};

describe("ServiceSidePanel", function () {

  describe("callback functionality", function () {
    beforeEach(function () {
      this.callback = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <ServiceSidePanel open={false} onClose={this.callback} />
      );
    });

    afterEach(function () {
      MesosSummaryStore.getServiceFromName = function () {
        return {name: "foo"};
      };
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
    beforeEach(function () {
      this.getServiceFromName = MesosSummaryStore.getServiceFromName;
      this.getServiceImage = MarathonStore.getServiceImage;
      var fakeFn = function (name) {
        if (name === "service_that_exists") {
          return {
            name: "foo",
            registered_time: 1000,
            tasks: []
          };
        }

        return null;
      };
      MesosSummaryStore.getServiceFromName = fakeFn;
      MesosStateStore.getServiceFromName = fakeFn;
    });

    afterEach(function () {
      MesosSummaryStore.getServiceFromName = this.getServiceFromName;
      MesosStateStore.getServiceFromName = this.getServiceFromName;
    });

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
        expect(TestUtils.isElement(info)).toEqual(true);
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

>>>>>>> Add tests for getInfo and getBasicInfo
});
