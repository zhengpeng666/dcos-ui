/** @jsx React.DOM */

jest.dontMock("../ProgressBar");
jest.dontMock("../../../mixins/InternalStorageMixin");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ProgressBar = require("../ProgressBar");

describe("ProgressBar", function () {

  it("has same style width as given percentage value", function () {
    var value=66;

    var progressbar = TestUtils.renderIntoDocument(
      <ProgressBar value={value} />
    );

    var bar = TestUtils.findRenderedDOMComponentWithClass(
      progressbar, "bar"
    );

    expect(bar.getDOMNode().style.width).toEqual(value + "%");
  });
});
