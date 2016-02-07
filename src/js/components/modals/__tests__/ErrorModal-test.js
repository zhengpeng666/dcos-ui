jest.dontMock('../ErrorModal');
jest.dontMock('../../../utils/DOMUtils');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

var ErrorModal = require('../ErrorModal');

describe('ErrorModal', function () {

  describe('#onClose', function () {
    beforeEach(function () {
      this.callback = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <ErrorModal
          onClose={this.callback} />
      );
    });

    it('shouldn\'t call the callback after initialization', function () {
      expect(this.callback).not.toHaveBeenCalled();
    });

    it('should call the callback when #onClose is called', function () {
      this.instance.onClose();
      expect(this.callback).toHaveBeenCalled();
    });

  });

});
