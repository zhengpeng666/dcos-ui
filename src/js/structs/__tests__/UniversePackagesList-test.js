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

  describe('#filterItems', function () {

    it('should filter by name', function () {
      var items = [
        {name: 'foo'},
        {name: 'bar'}
      ];
      var list = new UniversePackagesList({items});
      items = list.filterItems('bar').getItems();
      expect(items.length).toEqual(1);
      expect(items[0].get('name')).toEqual('bar');
    });

    it('should filter by description', function () {
      var items = [
        {description: 'foo'},
        {description: 'bar'}
      ];
      var list = new UniversePackagesList({items});
      items = list.filterItems('foo').getItems();
      expect(items.length).toEqual(1);
      expect(items[0].get('description')).toEqual('foo');
    });

    it('should filter by tags', function () {
      var items = [
        {tags: ['foo', 'bar']},
        {tags: ['foo']},
        {tags: []}
      ];
      var list = new UniversePackagesList({items});
      items = list.filterItems('foo').getItems();
      expect(items.length).toEqual(2);
      expect(items[0].get('tags')).toEqual(['foo', 'bar']);
      expect(items[1].get('tags')).toEqual(['foo']);
    });

    it('should handle filter by tags with null elements', function () {
      var items = [
        {tags: ['foo', 'bar']},
        {tags: ['foo']},
        {tags: null}
      ];
      var list = new UniversePackagesList({items});
      expect(list.filterItems.bind(list, 'foo')).not.toThrow();
    });

  });

});
