jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../ServiceList");
jest.dontMock("../ServiceOverlay");
jest.dontMock("../../utils/Store");
jest.dontMock("../../stores/MarathonStore");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ServiceList = require("../ServiceList");

describe("ServiceList", function () {

  describe("#shouldComponentUpdate", function () {

    beforeEach(function () {
      var services = [{name: "foo"}];
      this.instance = TestUtils.renderIntoDocument(
        <ServiceList
          services={services}
          healthProcessed={false} />
      );
    });

    it("should allow update", function () {
      var shouldUpdate = this.instance.shouldComponentUpdate({a: 1});
      expect(shouldUpdate).toEqual(true);
    });

    it("should not allow update", function () {
      var shouldUpdate = this.instance.shouldComponentUpdate(
        this.instance.props
      );
      expect(shouldUpdate).toEqual(false);
    });

  });

  describe("#getServices", function () {

    beforeEach(function () {
      var services = [{name: "foo"}];
      this.instance = TestUtils.renderIntoDocument(
        <ServiceList
          services={services}
          healthProcessed={false} />
      );
    });

    it("returns title as the value to display", function () {
      var services = [{
        name: "foo"
      }];
      var result = this.instance.getServices(services, false);

      expect(result[0].title.value).toEqual("foo");
    });

    it("returns title as a link", function () {
      var services = [{
        name: "foo",
        webui_url: "bar"
      }];
      var result = this.instance.getServices(services, false);

      expect(TestUtils.isElement(result[0].title.value)).toBe(true);
    });

  });

});
