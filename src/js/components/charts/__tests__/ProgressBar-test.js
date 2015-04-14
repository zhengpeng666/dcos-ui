/** @jsx React.DOM */

jest.dontMock("../ProgressBar");
jest.dontMock("../../../mixins/InternalStorageMixin");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ProgressBar = require("../ProgressBar");

describe("ProgressBar", function () {
  var value=66;

  it("has same style width as given percentage value", function () {
    var progressbar = TestUtils.renderIntoDocument(
      <ProgressBar value={value} />
    );

    var bar = TestUtils.findRenderedDOMComponentWithClass(
      progressbar, "bar"
    );

    expect(bar.getDOMNode().style.width).toEqual(value + "%");
  });

  it("has correct color index", function () {
    var colorIndex=2;

    var progressbar = TestUtils.renderIntoDocument(
      <ProgressBar colorIndex={colorIndex}
        value={value} />
    );

    TestUtils.findRenderedDOMComponentWithClass(
      progressbar, "color-" + colorIndex
    );
  });

});
