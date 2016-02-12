jest.dontMock('../Group');
jest.dontMock('../GroupsList');
jest.dontMock('../../utils/Util');

var Group = require('../Group');
var GroupsList = require('../GroupsList');

describe('GroupsList', function () {

  describe('#constructor', function () {

    it('creates instances of Group', function () {
      var items = [{foo: 'bar'}];
      var list = new GroupsList({items});
      items = list.getItems();
      expect(items[0] instanceof Group).toBeTruthy();
    });

  });

});
