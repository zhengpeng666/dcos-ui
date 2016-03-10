jest.dontMock('../ACLList');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

let ACLList = require('../ACLList');

let Item = SDK.get('Item');

describe('ACLList', function () {

  describe('#constructor', function () {

    it('creates instances of Item', function () {
      let items = [{foo: 'bar'}];
      let list = new ACLList({items});
      items = list.getItems();
      expect(items[0] instanceof Item).toBeTruthy();
    });

  });

  describe('#getItem', function () {

    it('returns an instance of Item', function () {
      let items = [{rid: 'bar'}];
      let list = new ACLList({items});
      let item = list.getItem('bar');
      expect(item instanceof Item).toBeTruthy();
    });

    it('returns the item if it is in the list', function () {
      let items = [{rid: 'bar'}];
      let list = new ACLList({items});
      let item = list.getItem('bar');
      expect(item.get('rid')).toBe('bar');
    });

    it('returns undefined if the item is not in the list', function () {
      let items = [{rid: 'bar'}];
      let list = new ACLList({items});
      let item = list.getItem('foo');
      expect(item).toBe(undefined);
    });

  });

});
