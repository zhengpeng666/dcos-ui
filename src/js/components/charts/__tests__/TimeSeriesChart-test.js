/** @jsx React.DOM */

jest.dontMock("../TimeSeriesChart");
jest.dontMock("../../../mixins/ChartMixin");
jest.dontMock("../../../mixins/InternalStorageMixin");

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var TimeSeriesChart = require("../TimeSeriesChart");

describe("TimeSeriesChart", function () {

  describe("#componentWillReceiveProps", function () {

    beforeEach(function () {
      var data = [];
      this.instance = TestUtils.renderIntoDocument(
        <TimeSeriesChart data={data} width={0} height={0} />
      );
      this.instance.renderAxis = jasmine.createSpy();
    });

    it("should call #renderAxis", function () {
      var props = _.extend({foo: "bar"}, this.instance.props);
      this.instance.componentWillReceiveProps(props);

      expect(this.instance.renderAxis).toHaveBeenCalled();
    });

    it("should not call #renderAxis", function () {
      this.instance.componentWillReceiveProps(
        this.instance.props
      );

      expect(this.instance.renderAxis).not.toHaveBeenCalled();
    });

  });

});
