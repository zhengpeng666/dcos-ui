jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../ServiceList');
jest.dontMock('../ServiceOverlay');
jest.dontMock('../../stores/MarathonStore');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var ServiceList = require('../ServiceList');

describe('ServiceList', function () {

  describe('#shouldComponentUpdate', function () {

    beforeEach(function () {
      var services = [{name: 'foo'}];
      this.instance = TestUtils.renderIntoDocument(
        <ServiceList
          services={services}
          healthProcessed={false} />
      );
    });

    it('should allow update', function () {
      var shouldUpdate = this.instance.shouldComponentUpdate({a: 1});
      expect(shouldUpdate).toEqual(true);
    });

    it('should not allow update', function () {
      var shouldUpdate = this.instance.shouldComponentUpdate(
        this.instance.props
      );
      expect(shouldUpdate).toEqual(false);
    });

  });

  describe('#getServices', function () {

    beforeEach(function () {
      var services = [{name: 'foo'}];
      this.instance = TestUtils.renderIntoDocument(
        <ServiceList
          services={services}
          healthProcessed={false} />
      );
    });

    it('returns services that have a value of two elements', function () {
      var services = [{
        name: 'foo'
      }];
      var result = this.instance.getServices(services, false);

      expect(result[0].content[0].content.key).toEqual('title');
      expect(result[0].content[1].content.key).toEqual('health');
    });
  });

});
