jest.dontMock("../MesosStateStore");
jest.dontMock("../../utils/Store");

var MesosStateStore = require("../MesosStateStore");

describe("MesosStateStore", function () {

  describe("#getTaskFromServiceName", function () {
    beforeEach(function () {
      this.get = MesosStateStore.get;
      MesosStateStore.get = function () {
        return {
          frameworks: [{
            name: "marathon",
            tasks: [1, 2, 3]
          }]
        };
      };
    });

    afterEach(function () {
      MesosStateStore.get = this.get;
    });

    it("should return tasks of service with name that matches", function () {
      var result = MesosStateStore.getTasksFromServiceName("marathon");
      expect(result).toEqual([1, 2, 3]);
    });

    it("should null if no service matches", function () {
      var result = MesosStateStore.getTasksFromServiceName("nonExistent");
      expect(result).toEqual([]);
    });
  });

  describe("#getNodeFromNodeID", function () {
    beforeEach(function () {
      this.get = MesosStateStore.get;
      MesosStateStore.get = function () {
        return {
          slaves: [{
            id: "amazon-thing",
            fakeProp: "fake"
          }]
        };
      };
    });

    afterEach(function () {
      MesosStateStore.get = this.get;
    });

    it("should return the node with the correct ID", function () {
      var result = MesosStateStore.getNodeFromNodeID("amazon-thing");
      expect(result.fakeProp).toEqual("fake");
    });

    it("should return null if node not found", function () {
      var result = MesosStateStore.getNodeFromNodeID("nonExistentNode");
      expect(result).toEqual(null);
    });
  });
});
