jest.dontMock('../AdvancedConfigModal');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var AdvancedConfigModal = require('../AdvancedConfigModal');

describe('AdvancedConfigModal', function () {
  beforeEach(function () {
    this.instance = TestUtils.renderIntoDocument(
      <AdvancedConfigModal />
    );
  });

  afterEach(function () {
    this.instance.state = {reviewingConfig: false};
  });

  describe('left button', function () {
    it('should have left button text \'Cancel\' if not reviewing', function () {
      var result = this.instance.getLeftButtonText();
      expect(result).toEqual('Cancel');
    });

    it('should have left button text \'Back\' if reviewing', function () {
      this.instance.state = {reviewingConfig: true};
      var result = this.instance.getLeftButtonText();
      expect(result).toEqual('Back');
    });

    it('should return callback for left button that sets reviewing to false',
      function () {
      this.instance.state.reviewingConfig = true;
      var callback = this.instance.getLeftButtonCallback();
      callback();
      expect(this.instance.state.reviewingConfig).toEqual(false);
    });

    it('should return callback for right button that calls #onClose',
      function () {
      this.instance.props.onClose = jasmine.createSpy();
      var callback = this.instance.getLeftButtonCallback();
      callback();

      expect(this.instance.props.onClose).toHaveBeenCalled();
    });
  });

  describe('right button', function () {
    it('should have right button text \'Review and Install\' if  not reviewing',
      function () {
      var result = this.instance.getRightButtonText();
      expect(result).toEqual('Review and Install');
    });

    it('should have right button text \'Install\' if reviewing', function () {
      this.instance.state = {reviewingConfig: true};
      var result = this.instance.getRightButtonText();
      expect(result).toEqual('Install');
    });

    it('should return callback for right button that sets reviewing to true',
      function () {
      var callback = this.instance.getRightButtonCallback();
      callback();
      expect(this.instance.state.reviewingConfig).toEqual(true);
    });

    it('should return callback for right button that calls #handleInstallClick',
      function () {
      this.instance.handleInstallClick = jasmine.createSpy();
      this.instance.state.reviewingConfig = true;
      var callback = this.instance.getRightButtonCallback();
      callback();

      expect(this.instance.handleInstallClick).toHaveBeenCalled();
    });
  });
});
