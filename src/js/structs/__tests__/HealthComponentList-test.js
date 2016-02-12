jest.dontMock('../HealthComponent');
jest.dontMock('../HealthComponentList');

var HealthComponent = require('../HealthComponent');
var HealthComponentList = require('../HealthComponentList');

describe('HealthComponentList', function () {

  describe('#constructor', function () {

    it('creates instances of HealthComponent', function () {
      var items = [{foo: 'bar'}];
      var list = new HealthComponentList({items});
      items = list.getItems();
      expect(items[0] instanceof HealthComponent).toBeTruthy();
    });

  });

});
