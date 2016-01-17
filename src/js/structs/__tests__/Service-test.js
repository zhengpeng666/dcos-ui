let Service = require('../Service');

describe('Service', function () {

  describe('#getNodeIDs', function () {

    it('returns ids of nodes the service is running on', function () {
      let service = new Service({slave_ids: [1, 2, 3]});
      expect(service.getNodeIDs()).toEqual([1, 2, 3]);
    });

  });

  describe('#getUsageStats', function () {

    it('returns an object containing the value for the resource', function () {
      let service = new Service({used_resources: {cpus: 1, mem: 512}});
      expect(service.getUsageStats('cpus').value).toEqual(1);
      expect(service.getUsageStats('mem').value).toEqual(512);
    });

  });

});
