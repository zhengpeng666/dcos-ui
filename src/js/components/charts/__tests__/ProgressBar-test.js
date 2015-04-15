/** @jsx React.DOM */

jest.dontMock("../ProgressBar");
jest.dontMock("../../../mixins/InternalStorageMixin");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ProgressBar = require("../ProgressBar");

describe("ProgressBar", function () {
  var value = 66;
  var progressbar;

  it("has same style width as given percentage value", function () {
    progressbar = TestUtils.renderIntoDocument(
      <ProgressBar value={value} />
    );

    var bar = TestUtils.findRenderedDOMComponentWithClass(
      progressbar, "bar"
    );

    expect(bar.getDOMNode().style.width).toEqual(value + "%");
  });

  it("will recieve new property for percentage value", function () {
    var updatedvalue = 88;
    progressbar.setProps({value: updatedvalue});

    var bar = TestUtils.findRenderedDOMComponentWithClass(
      progressbar, "bar"
    );

    expect(bar.getDOMNode().style.width).toEqual(updatedvalue + "%");
  });

  it("has correct color index", function () {
    var colorIndex = 2;

    var progressbar = TestUtils.renderIntoDocument(
      <ProgressBar colorIndex={colorIndex}
        value={value} />
    );

    TestUtils.findRenderedDOMComponentWithClass(
      progressbar, "color-" + colorIndex
    );
  });

});
