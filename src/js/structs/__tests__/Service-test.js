let Service = require("../Service");

describe("Service", function () {

  describe("#getNodeIDs", function () {

    it("returns ids of nodes the service is running on", function () {
      let service = new Service({slave_ids: [1, 2, 3]});
      expect(service.getNodeIDs()).toEqual([1, 2, 3]);
    });

  });

});
