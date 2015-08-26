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

  describe("#getModal", function () {
    it("should return null if modal is not open", function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal open={false} />
      );

      var modal = instance.getModal();
      expect(modal).toEqual(null);
    });

    it("should return something if modal is open", function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal open={true} />
      );

      var modal = instance.getModal();
      expect(TestUtils.isElement(modal)).toEqual(true);
    });
  });

  describe("rerender functionality", function () {
    it("should render twice when opening", function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal open={false} />
      );

      spyOn(instance, "render").andCallThrough();
      instance.setProps({open: true});

      expect(instance.render.callCount).toEqual(2);
    });

    it("should render once if not open", function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal open={true} />
      );

      spyOn(instance, "render").andCallThrough();
      instance.setProps({open: false});
      expect(instance.render.callCount).toEqual(1);
    });
  });

  describe("#innerContainerDOMNode", function () {
    it("should be set after opening", function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal open={false} />
      );

      instance.setProps({open: true}, function () {
        expect(!!instance.innerContainerDOMNode).toEqual(true);
      });
    });

    it("should be set to null after closing", function () {
      var instance = TestUtils.renderIntoDocument(
        <Modal open={true} />
      );

      instance.closeModal();
      expect(instance.innerContainerDOMNode).toEqual(null);
    });
  });
});
