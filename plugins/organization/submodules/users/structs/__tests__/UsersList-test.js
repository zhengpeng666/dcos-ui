jest.dontMock('../User');
jest.dontMock('../UsersList');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

var User = require('../User');
var UsersList = require('../UsersList');

describe('UsersList', function () {

  describe('#constructor', function () {

    it('creates instances of User', function () {
      var items = [{foo: 'bar'}];
      var list = new UsersList({items});
      items = list.getItems();
      expect(items[0] instanceof User).toBeTruthy();
    });

  });

});
