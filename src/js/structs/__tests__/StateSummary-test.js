jest.dontMock("../StateSummary");
jest.dontMock("../../utils/MesosSummaryUtil");

var StateSummary = require("../StateSummary");

describe("StateSummary", function () {

  describe("#constructor", function () {

    it("constructs a state", function () {
      var instance = new StateSummary();
      expect(instance instanceof StateSummary).toEqual(true);
    });

  });

  describe("#getActiveSlaves", function () {

    it("returns 0 active slaves by default", function () {
      var instance = new StateSummary();
      expect(instance.getActiveSlaves()).toEqual(0);
    });

    it("correctly calculates active slaves", function () {
      var snapshot = {
        frameworks: [],
        slaves: [
          {active: true},
          {active: false},
          {active: true}
        ]
      };
      var instance = new StateSummary({snapshot});
      expect(instance.getActiveSlaves()).toEqual(2);
    });

  });

  describe("#getSnapshotDate", function () {

    it("creates a date when initialized", function () {
      var before = Date.now();
      var instance = new StateSummary();
      var after = Date.now();

      expect(instance.getSnapshotDate() >= before).toBeTruthy();
      expect(instance.getSnapshotDate() <= after).toBeTruthy();
    });

    it("allows us to set the date", function () {
      var date = Date.now();
      var instance = new StateSummary({date});
      expect(instance.getSnapshotDate() === date).toBeTruthy();
    });

  });

  describe("#getTotalSlaveResources", function () {

    it("defaults to 0 available resources if there's nothing", function () {
      var instance = new StateSummary();
      var defaultSum = {cpus: 0, mem: 0, disk: 0};
      expect(instance.getTotalSlaveResources()).toEqual(defaultSum);
    });

    it("calculates total resources available in slaves", function () {
      var snapshot = {
        frameworks: [],
        slaves: [
          {resources: {cpus: 1, mem: 0, disk: 2}},
          {resources: {cpus: 1, mem: 0, disk: 2}},
          {resources: {cpus: 1, mem: 0, disk: 2}}
        ]
      };
      var aggregate = {cpus: 3, mem: 0, disk: 6};
      var instance = new StateSummary({snapshot});
      expect(instance.getTotalSlaveResources()).toEqual(aggregate);
    });

  });

  describe("#getFrameworkUsedResources", function () {

    it("defaults to 0 available resources if there's nothing", function () {
      var instance = new StateSummary();
      var defaultSum = {cpus: 0, mem: 0, disk: 0};
      expect(instance.getFrameworkUsedResources()).toEqual(defaultSum);
    });

    it("calculates total resources available in slaves", function () {
      var snapshot = {
        frameworks: [
          {used_resources: {cpus: 1, mem: 0, disk: 2}},
          {used_resources: {cpus: 1, mem: 0, disk: 2}},
          {used_resources: {cpus: 1, mem: 0, disk: 2}}
        ],
        slaves: []
      };
      var aggregate = {cpus: 3, mem: 0, disk: 6};
      var instance = new StateSummary({snapshot});
      expect(instance.getFrameworkUsedResources()).toEqual(aggregate);
    });

  });

});
