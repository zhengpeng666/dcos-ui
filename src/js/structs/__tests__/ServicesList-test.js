jest.dontMock("../List");
jest.dontMock("../ServicesList");
jest.dontMock("../../stores/MarathonStore");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/Store");

let MarathonStore = require("../../stores/MarathonStore");
let ServicesList = require("../ServicesList");

describe("ServicesList", function () {

  describe("#filter", function () {

    it("returns unfiltered list", function () {
      let list = new ServicesList({items: [0, 1, 2]});
      expect(list.filter().getItems()).toEqual([0, 1, 2]);
    });

    it("filters by health", function () {
      var oldFunction = MarathonStore.getServiceHealth;
      MarathonStore.getServiceHealth = function (name) {
        switch (name) {
          case "marathon":
          case "marathon-user":
            return {value: 1};
          default:
            return {value: 0};
        }
      };

      let items = [
        {name: "marathon"},
        {name: "chronos"},
        {name: "marathon-user"}
      ];
      let expectedList = [{name: "chronos"}];
      let list = new ServicesList({items});
      let filteredList = list.filter({health: 0}).getItems();
      expect(filteredList).toEqual(expectedList);

      // Reset
      MarathonStore.getServiceHealth = oldFunction;
    });

    it("filters by name", function () {
      let items = [
        {name: "marathon"},
        {name: "chronos"},
        {name: "marathon-user"}
      ];
      let expectedList = [
        {name: "marathon"},
        {name: "marathon-user"}
      ];
      let list = new ServicesList({items});
      let filteredList = list.filter({name: "marath"}).getItems();
      expect(filteredList).toEqual(expectedList);
    });

    it("filters by ids", function () {
      let items = [
        {id: 1, name: "marathon"},
        {id: 2, name: "chronos"},
        {id: "3", name: "marathon-user"}
      ];
      let expectedList = [
        {id: 2, name: "chronos"},
        {id: "3", name: "marathon-user"}
      ];
      let list = new ServicesList({items});
      let filteredList = list.filter({ids: [2, "3"]}).getItems();
      expect(filteredList).toEqual(expectedList);
    });

  });

  describe("#sumUsedResources", function () {

    it("returns all resources as 0 when there's no services", function () {
      let list = new ServicesList();
      expect(list.sumUsedResources()).toEqual({cpus: 0, mem: 0, disk: 0});
    });

    it("returns used resources when there's one service", function () {
      let list = new ServicesList({items: [
        {used_resources: {cpus: 1, mem: 3, disk: 1}}
      ]});
      expect(list.sumUsedResources()).toEqual({cpus: 1, mem: 3, disk: 1});
    });

    it("sums used resources for services", function () {
      let list = new ServicesList({items: [
        {used_resources: {cpus: 1, mem: 3, disk: 1}},
        {used_resources: {cpus: 1, mem: 3, disk: 1}}
      ]});
      expect(list.sumUsedResources()).toEqual({cpus: 2, mem: 6, disk: 2});
    });

  });

});
