jest.dontMock("../Modal");
jest.dontMock("../../utils/DOMUtils");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var Modal = require("../Modal");

describe("Modal", function () {

  describe("#handleBackdropClick", function () {
    beforeEach(function () {
      this.callback = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <Modal onClose={this.callback} />
      );
    });

    it("shouldn't call the callback after initialization", function () {
      expect(this.callback).not.toHaveBeenCalled();
    });

    it("should call the callback when the backdrop is clicked", function () {
      this.instance.handleBackdropClick();
      expect(this.callback).toHaveBeenCalled();
    });

  });

  describe("#getFooter", function () {

    it("should not return a footer when its disabled", function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal showFooter={false} />
      );

      expect(instance.getFooter()).toEqual(null);
    });

    it("should return content for the footer when enabled", function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal showFooter={true} />
      );

      var footer = instance.getFooter();
      expect(TestUtils.isElement(footer)).toEqual(true);
    });

  });

});
