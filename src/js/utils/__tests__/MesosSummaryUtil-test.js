jest.dontMock("../../config/Config");
jest.dontMock("../../stores/MarathonStore");
jest.dontMock("../Maths");
jest.dontMock("../MesosSummaryUtil");

let MesosSummaryUtil = require("../MesosSummaryUtil");

describe("MesosSummaryUtil", function () {

  describe("#stateResourcesToResourceStates", function () {

    it("returns empty resource states lists", function () {
      let resourceStates = MesosSummaryUtil.stateResourcesToResourceStates([]);
      expect(resourceStates).toEqual({cpus: [], mem: [], disk: []});
    });

    it("transposes state resources to resource states", function () {
      let stateResources = [{
        date: 1,
        resources: {cpus: 2, mem: 3, disk: 2},
        totalResources: {cpus: 4, mem: 3, disk: 4}
      }];
      let resourceStates = MesosSummaryUtil.stateResourcesToResourceStates(
        stateResources
      );

      let expectedResult = {
        cpus: [{date: 1, value: 2, percentage: 50}],
        mem: [{date: 1, value: 3, percentage: 100}],
        disk: [{date: 1, value: 2, percentage: 50}]
      };

      expect(resourceStates).toEqual(expectedResult);
    });

    it("transposes multiple state resources to resource states", function () {
      let stateResources = [
        {
          date: 1,
          resources: {cpus: 2, mem: 3, disk: 2},
          totalResources: {cpus: 4, mem: 3, disk: 4}
        }, {
          date: 2,
          resources: {cpus: 7, mem: 3, disk: 4},
          totalResources: {cpus: 10, mem: 3, disk: 4}
        }
      ];
      let resourceStates = MesosSummaryUtil.stateResourcesToResourceStates(
        stateResources
      );

      let expectedResult = {
        cpus: [
          {date: 1, value: 2, percentage: 50},
          {date: 2, value: 7, percentage: 70}
        ],
        mem: [
          {date: 1, value: 3, percentage: 100},
          {date: 2, value: 3, percentage: 100}
        ],
        disk: [
          {date: 1, value: 2, percentage: 50},
          {date: 2, value: 4, percentage: 100}
        ]
      };

      expect(resourceStates).toEqual(expectedResult);
    });

  });

});
