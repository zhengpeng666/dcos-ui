jest.dontMock('../ServerErrorModal');
jest.dontMock('../../utils/Util');
jest.dontMock('../../utils/StringUtil');
jest.dontMock('../../stores/ACLAuthStore');
jest.dontMock('../../stores/ACLGroupsStore');
jest.dontMock('../../stores/ACLGroupStore');
jest.dontMock('../../stores/ACLStore');
jest.dontMock('../../stores/ACLUsersStore');
jest.dontMock('../../stores/ACLUserStore');
jest.dontMock('../../constants/EventTypes');
jest.dontMock('../../stores/MarathonStore');
jest.dontMock('../../stores/MesosStateStore');
jest.dontMock('../../stores/MesosSummaryStore');
jest.dontMock('../../events/ACLAuthActions');
jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../constants/EventTypes');
jest.dontMock('../../mixins/GetSetMixin');

require('../../utils/StoreMixinConfig');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

var ServerErrorModal = require('../ServerErrorModal');

describe('ServerErrorModal', function () {
  beforeEach(function () {
    this.instance = TestUtils.renderIntoDocument(
      <ServerErrorModal />
    );
  });

  describe('#handleModalClose', function () {
    beforeEach(function () {
      this.instance.handleModalClose();
    });

    it('closes the modal', function () {
      expect(this.instance.state.isOpen).toEqual(false);
    });

    it('resets the error array', function () {
      expect(this.instance.state.errors).toEqual([]);
    });

  });

  describe('#handleServerError', function () {

    it('doesn\'t throw when an id and errorMessage are passed', function () {
      let fn = this.instance.handleServerError.bind(
        this.instance, 'foo', 'bar'
      );
      expect(fn).not.toThrow();
    });

    it('doesn\'t throw when an id is passed', function () {
      let fn = this.instance.handleServerError.bind(this.instance, 'foo');
      expect(fn).not.toThrow();
    });

    it('throws an error when no id or errorMessage is passed', function () {
      let fn = this.instance.handleServerError.bind(this.instance);
      expect(fn).toThrow();
    });

  });

  describe('#getContent', function () {
    it('should return the same number of children as errors', function () {
      this.instance.state.errors = [1, 2, 3];
      var contents = this.instance.getContent();
      var result = contents.props.children;

      expect(result.length).toEqual(3);
    });
  });
});
