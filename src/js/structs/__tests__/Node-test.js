let Node = require("../Node");

describe("Node", function () {

  describe("#getServices", function () {

    it("returns ids of services running on node", function () {
      let node = new Node({framework_ids: [1, 2, 3]});
      expect(node.getServices()).toEqual([1, 2, 3]);
    });

  });

  describe("#getActive", function () {

    it("return false when node is innactive", function () {
      let node = new Node({active: false});
      expect(node.isActive()).toBeFalsy();
    });

    it("return true when node is nactive", function () {
      let node = new Node({active: true});
      expect(node.isActive()).toBeTruthy();
    });

  });

  describe("#getUsageStats", function () {

    it("returns usage stats for given resource", function () {
      let node = new Node({
        resources: {cpus: 10},
        used_resources: {cpus: 5}
      });
      let stats = {
        percentage: 50,
        total: 10,
        value: 5
      }
      expect(node.getUsageStats("cpus")).toEqual(stats);
    });

  });

});
