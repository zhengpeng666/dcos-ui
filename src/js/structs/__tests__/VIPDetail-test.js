var fixturePath = '../../../../tests/_fixtures/networking/networking-vip-detail.json';

jest.dontMock(fixturePath);

var VIPDetail = require('../VIPDetail');
var vipDetailFixture = require(fixturePath);

describe('VIPDetail', function () {

  beforeEach(function () {
    this.vipDetail = new VIPDetail(vipDetailFixture);
  });

  describe('#getBackends', function () {

    it('returns the all of the backends it was given', function () {
      expect(this.vipDetail.getBackends().length).toEqual(
        vipDetailFixture.backends.length
      );
    });

  });

});
