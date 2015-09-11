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
});
