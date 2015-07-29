jest.dontMock("../../Modal");
jest.dontMock("../CliInstallModal");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var CliInstallModal = require("../CliInstallModal");

describe("CliInstallModal", function () {

  describe("#onClose", function () {
    beforeEach(function () {
      this.callback = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <CliInstallModal
          onClose={this.callback}
          showFooter={false}
          title=""
          subHeaderContent="" />
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

  describe("#getCliInstructions", function () {
    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <CliInstallModal
          onClose={function () {}}
          showFooter={false}
          title=""
          subHeaderContent="" />
      );
    });

    it("it returns different data depending on OS", function () {
      window.navigator.userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)";
      var firstCall = this.instance.getCliInstructions();
      window.navigator.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36";
      var secondCall = this.instance.getCliInstructions();

      expect(firstCall).not.toEqual(secondCall);
    });

  });

});
