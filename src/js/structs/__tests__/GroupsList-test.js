jest.dontMock('../Group');
jest.dontMock('../GroupsList');
jest.dontMock('../../utils/Util');

let Group = require('../Group');
let GroupsList = require('../GroupsList');

describe('GroupsList', function () {

  describe('#constructor', function () {

    it('creates instances of Group', function () {
      let items = [{foo: 'bar'}];
      let list = new GroupsList({items});
      items = list.getItems();
      expect(items[0] instanceof Group).toBeTruthy();
    });

  });

});
