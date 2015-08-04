jest.dontMock("../../Modal");
jest.dontMock("../VersionsModal");
jest.dontMock("../../../utils/DOMUtils");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var VersionsModal = require("../VersionsModal");

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
        <VersionsModal onClose={function () {}} versionDump={data} />
      );
    });

    it("should return a pre element tag", function () {
      var tag = TestUtils.findRenderedDOMComponentWithTag(
        this.instance, "pre"
      );
      expect(tag.tagName).toBe("PRE");
    });

    it("should return a pre element tag", function () {
      var tag = TestUtils.findRenderedDOMComponentWithTag(
        this.instance, "pre"
      );
      expect(tag.getDOMNode().innerHTML).toEqual("{\n  \"foo\": \"bar\"\n}");
    });

  });

});
