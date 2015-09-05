jest.dontMock("../../utils/MesosSummaryUtil");

let Service = require("../Service");
let ServicesList = require("../ServicesList");
let StateSummary = require("../StateSummary");

describe("StateSummary", function () {

  describe("#constructor", function () {

    it("constructs a state", function () {
      let instance = new StateSummary();
      expect(instance instanceof StateSummary).toEqual(true);
    });

  });

  describe("#getServiceList", function () {

    it("returns an instance of ServicesList", function () {
      let instance = new StateSummary();
      let services = instance.getServiceList();
      expect(services instanceof ServicesList).toBeTruthy();
    });

    it("ServicesList contains instances of Service", function () {
      let frameworks = [{a: 1}];
      let instance = new StateSummary({snapshot: {frameworks}});
      let services = instance.getServiceList();
      expect(services.getItems().length).toEqual(1);
      expect(services.getItems()[0] instanceof Service).toBeTruthy();
    });

  });

  describe("#getActiveSlaves", function () {

    it("returns 0 active slaves by default", function () {
      let instance = new StateSummary();
      expect(instance.getActiveSlaves()).toEqual(0);
    });

    it("correctly calculates active slaves", function () {
      let snapshot = {
        frameworks: [],
        slaves: [
          {active: true},
          {active: false},
          {active: true}
        ]
      };
      let instance = new StateSummary({snapshot});
      expect(instance.getActiveSlaves()).toEqual(2);
    });

  });

  describe("#getSnapshotDate", function () {

    it("creates a date when initialized", function () {
      let before = Date.now();
      let instance = new StateSummary();
      let after = Date.now();

      expect(instance.getSnapshotDate() >= before).toBeTruthy();
      expect(instance.getSnapshotDate() <= after).toBeTruthy();
    });

    it("allows us to set the date", function () {
      let date = Date.now();
      let instance = new StateSummary({date});
      expect(instance.getSnapshotDate() === date).toBeTruthy();
    });

  });

  describe("#getTotalSlaveResources", function () {

    it("defaults to 0 available resources if there's nothing", function () {
      let instance = new StateSummary();
      let defaultSum = {cpus: 0, mem: 0, disk: 0};
      expect(instance.getTotalSlaveResources()).toEqual(defaultSum);
    });

    it("calculates total resources available in slaves", function () {
      let snapshot = {
        frameworks: [],
        slaves: [
          {resources: {cpus: 1, mem: 0, disk: 2}},
          {resources: {cpus: 1, mem: 0, disk: 2}},
          {resources: {cpus: 1, mem: 0, disk: 2}}
        ]
      };
      let aggregate = {cpus: 3, mem: 0, disk: 6};
      let instance = new StateSummary({snapshot});
      expect(instance.getTotalSlaveResources()).toEqual(aggregate);
    });

  });

  describe("#getFrameworkUsedResources", function () {

    it("defaults to 0 available resources if there's nothing", function () {
      let instance = new StateSummary();
      let defaultSum = {cpus: 0, mem: 0, disk: 0};
      expect(instance.getFrameworkUsedResources()).toEqual(defaultSum);
    });

    it("calculates total resources available in slaves", function () {
      let snapshot = {
        frameworks: [
          {used_resources: {cpus: 1, mem: 0, disk: 2}},
          {used_resources: {cpus: 1, mem: 0, disk: 2}},
          {used_resources: {cpus: 1, mem: 0, disk: 2}}
        ],
        slaves: []
      };
      let aggregate = {cpus: 3, mem: 0, disk: 6};
      let instance = new StateSummary({snapshot});
      expect(instance.getFrameworkUsedResources()).toEqual(aggregate);
    });

  });

});
