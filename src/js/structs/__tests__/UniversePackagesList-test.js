jest.dontMock('../UniversePackage');
jest.dontMock('../UniversePackagesList');
jest.dontMock('../../utils/Util');

var UniversePackage = require('../UniversePackage');
var UniversePackagesList = require('../UniversePackagesList');

describe('UniversePackagesList', function () {

  describe('#constructor', function () {

    it('creates instances of UniversePackage', function () {
      var items = [{foo: 'bar'}];
      var list = new UniversePackagesList({items});
      items = list.getItems();
      expect(items[0] instanceof UniversePackage).toBeTruthy();
    });

  });

});
