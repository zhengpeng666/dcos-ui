var Backend = require('../Backend');
var BackendList = require('../BackendList');

describe('BackendList', function () {

  describe('#constructor', function () {

    it('creates instances of Backend', function () {
      var items = [{foo: 'bar'}];
      var list = new BackendList({items});
      items = list.getItems();
      expect(items[0] instanceof Backend).toBeTruthy();
    });

  });

});
