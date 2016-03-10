jest.dontMock('../Group');
jest.dontMock('../GroupsList');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);
// var Group = require('../Group');
// var GroupsList = require('../GroupsList');

describe('GroupsList', function () {

  describe('#constructor', function () {
    /*
    TODO - Fix circular dependency to resolve this test correctly
     */

    // it('creates instances of Group', function () {
    //   var items = [{foo: 'bar'}];
    //   var list = new GroupsList({items});
    //   items = list.getItems();
    //   expect(items[0] instanceof Group).toBeTruthy();
    // });

  });

});
