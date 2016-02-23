jest.dontMock('../UniversePackage');
jest.dontMock('../UniverseInstalledPackagesList');

var UniversePackage = require('../UniversePackage');
var UniverseInstalledPackagesList = require('../UniverseInstalledPackagesList');

describe('UniverseInstalledPackagesList', function () {

  describe('#constructor', function () {

    it('creates instances of UniversePackage', function () {
      var items = [{packageInformation: {foo: 'bar'}}];
      var list = new UniverseInstalledPackagesList({items});
      items = list.getItems();
      expect(items[0] instanceof UniversePackage).toBeTruthy();
    });

  });

  describe('#filterItems', function () {

    it('should filter by name', function () {
      var items = [
        {packageInformation: {packageDefinition: {name: 'foo'}}},
        {packageInformation: {packageDefinition: {name: 'bar'}}}
      ];
      var list = new UniverseInstalledPackagesList({items});
      items = list.filterItems('bar').getItems();
      expect(items.length).toEqual(1);
      expect(items[0].get('packageDefinition').name).toEqual('bar');
    });

    it('should filter by description', function () {
      var items = [
        {packageInformation: {packageDefinition: {description: 'foo'}}},
        {packageInformation: {packageDefinition: {description: 'bar'}}}
      ];
      var list = new UniverseInstalledPackagesList({items});
      items = list.filterItems('foo').getItems();
      expect(items.length).toEqual(1);
      expect(items[0].get('packageDefinition').description).toEqual('foo');
    });

    it('should filter by tags', function () {
      var items = [
        {packageInformation: {packageDefinition: {tags: ['foo', 'bar']}}},
        {packageInformation: {packageDefinition: {tags: ['foo']}}},
        {packageInformation: {packageDefinition: {tags: []}}}
      ];
      var list = new UniverseInstalledPackagesList({items});
      items = list.filterItems('foo').getItems();
      expect(items.length).toEqual(2);
      expect(items[0].get('packageDefinition').tags).toEqual(['foo', 'bar']);
      expect(items[1].get('packageDefinition').tags).toEqual(['foo']);
    });

    it('should handle filter by tags with null elements', function () {
      var items = [
        {packageInformation: {packageDefinition: {tags: ['foo', 'bar']}}},
        {packageInformation: {packageDefinition: {tags: ['foo']}}},
        {packageInformation: {packageDefinition: {tags: null}}}
      ];
      var list = new UniverseInstalledPackagesList({items});
      expect(list.filterItems.bind(list, 'foo')).not.toThrow();
    });

  });

});
