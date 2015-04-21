/** @jsx React.DOM */

jest.dontMock("../ServiceList");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ServiceList = require("../ServiceList");

describe("ServiceList", function () {

  describe("#shouldComponentUpdate", function () {

    beforeEach(function () {
      var services = [{name: "foo"}];
      this.instance = TestUtils.renderIntoDocument(
        <ServiceList services={services} healthProcessed={false} />
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

});
