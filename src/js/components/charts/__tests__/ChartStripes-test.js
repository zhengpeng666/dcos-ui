/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("../ChartStripes");
var ChartStripes = require("../ChartStripes");

describe("ChartStripes", function () {

  beforeEach(function () {
    this.instance = TestUtils.renderIntoDocument(
      <ChartStripes
        count={6}
        height={10}
        width={300} />
    );
  });

  it("should display the correct number of stripes", function () {
    var stripes = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, "background"
    );
    expect(stripes.length).toEqual(6);
  });

  it("should have correct width on each stripe", function () {
    var stripes = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, "background"
    );

    _.each(stripes, function (stripe) {
      expect(parseInt(stripe.getDOMNode().attributes.width.value, 10))
        .toEqual(25);
    });
  });

  it("should have correct x value on each stripe", function () {
    var stripes = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, "background"
    );

    _.each(stripes, function (stripe, i) {
      expect(parseInt(stripe.getDOMNode().attributes.x.value, 10))
        .toEqual(25 + i * 50);
    });
  });

  it("should update to parameter change accordingly", function () {
    var stripes = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, "background"
    );
    expect(stripes.length).toEqual(6);

    this.instance.setProps({count: 5});

    stripes = TestUtils.scryRenderedDOMComponentsWithClass(
      this.instance, "background"
    );
    expect(stripes.length).toEqual(5);

    _.each(stripes, function (stripe) {
      expect(parseInt(stripe.getDOMNode().attributes.width.value, 10))
        .toEqual(30);
    });

    _.each(stripes, function (stripe, i) {
      expect(parseInt(stripe.getDOMNode().attributes.x.value, 10))
        .toEqual(30 + i * 60);
    });
  });

});
