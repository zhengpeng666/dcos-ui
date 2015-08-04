jest.dontMock("../ProgressBar");
jest.dontMock("../../../mixins/InternalStorageMixin");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ProgressBar = require("../ProgressBar");

describe("ProgressBar", function () {

  beforeEach(function () {
    this.progressbar = TestUtils.renderIntoDocument(
      <ProgressBar colorIndex={2} value={66} />
    );
  });

  it("has same style width as given percentage value", function () {
    var bar = TestUtils.findRenderedDOMComponentWithClass(
      this.progressbar, "bar"
    );

    expect(bar.getDOMNode().style.width).toEqual("66%");
  });

  it("will recieve new property for percentage value", function () {
    this.progressbar.setProps({value: 88});

    var bar = TestUtils.findRenderedDOMComponentWithClass(
      this.progressbar, "bar"
    );

    expect(bar.getDOMNode().style.width).toEqual("88%");
  });

  it("has correct color index", function () {
    var fn = TestUtils.findRenderedDOMComponentWithClass.bind(TestUtils,
      this.progressbar, "color-2"
    );
    expect(fn).not.toThrow();
  });

});
