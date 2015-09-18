jest.dontMock("../../../utils/DOMUtils");
jest.dontMock("../VersionsModal");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var VersionsModal = require("../VersionsModal");

function renderAndFindTag(instance, tag) {
  var result = TestUtils.renderIntoDocument(instance);
  return TestUtils.findRenderedDOMComponentWithTag(result, tag);
}

describe("VersionsModal", function () {

  describe("#onClose", function () {
    beforeEach(function () {
      this.callback = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <VersionsModal onClose={this.callback} versionDump={{}} />
      );
    });

    it("shouldn't call the callback after initialization", function () {
      expect(this.callback).not.toHaveBeenCalled();
    });

    it("should call the callback when #onClose is called", function () {
      this.instance.onClose();
      expect(this.callback).toHaveBeenCalled();
    });

  });

  describe("#getContent", function () {
    beforeEach(function () {
      var data = {foo: "bar"};
      this.instance = TestUtils.renderIntoDocument(
        <VersionsModal onClose={function () {}} versionDump={data} open={true}/>
      );
    });

    it("should return a pre element tag", function () {
      var content = this.instance.getContent();
      var result = renderAndFindTag(content, "pre");

      expect(result.tagName).toBe("PRE");
    });

    it("should return a pre element tag", function () {
      var content = this.instance.getContent();
      var result = renderAndFindTag(content, "pre");

      expect(result.getDOMNode().innerHTML).toEqual("\n{\n  \"foo\": \"bar\"\n}");
    });

  });

});
