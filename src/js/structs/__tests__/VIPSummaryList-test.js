var VIPSummary = require('../VIPSummary');
var VIPSummaryList = require('../VIPSummaryList');

describe('VIPSummaryList', function () {

  describe('#constructor', function () {

    it('creates instances of VIPSummary', function () {
      var items = [{foo: 'bar'}];
      var list = new VIPSummaryList({items});
      items = list.getItems();
      expect(items[0] instanceof VIPSummary).toBeTruthy();
    });

  });

});
