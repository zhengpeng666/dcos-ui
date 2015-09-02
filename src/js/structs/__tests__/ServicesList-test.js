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
      expect(list.filter()).toEqual([0, 1, 2]);
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
      expect(list.filter({health: 0})).toEqual(expectedList);

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
      expect(list.filter({name: "marath"})).toEqual(expectedList);
    });

  });

});
