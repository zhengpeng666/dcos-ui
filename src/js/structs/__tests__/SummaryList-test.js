jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/Maths");

let SummaryList = require("../SummaryList");
let StateSummary = require("../StateSummary");

describe("SummaryList", function () {

  describe("#add", function () {

    it("shifts elements off the list when max length is set", function () {
      let list = new SummaryList({items: [0], maxLength: 2});
      list.add(1);
      list.add(2);
      expect(list.getItems()).toEqual([1, 2]);
    });

  });

  describe("#addSnapshot", function () {

    it("adds new item to list", function () {
      let list = new SummaryList();
      expect(list.getItems().length).toEqual(0);
      list.addSnapshot({}, Date.now());
      expect(list.getItems().length).toEqual(1);
    });

    it("creates an instance of StateSummary out of an object", function () {
      let list = new SummaryList();
      list.addSnapshot({}, Date.now());
      let instance = list.last();
      expect(instance instanceof StateSummary).toEqual(true);
    });

  });

  describe("#getResourceStatesForServiceIDs", function () {

    beforeEach(function () {
      this.now = Date.now();
      this.list = new SummaryList();
      this.list.addSnapshot({
        frameworks: [
          {id: 1, used_resources: {cpus: 1, mem: 3, disk: 1}},
          {id: 2, used_resources: {cpus: 1, mem: 3, disk: 1}}
        ],
        slaves: [
          {resources: {cpus: 10, mem: 10, disk: 10}}
        ]
      }, this.now);
    });

    it("returns empty resource lists", function () {
      let list = new SummaryList();
      let resources = list.getResourceStatesForServiceIDs();
      expect(resources).toEqual({cpus: [], mem: [], disk: []});
    });

    it("doesn't filter by ids", function () {
      let resources = this.list.getResourceStatesForServiceIDs();
      let expectedResult = {
        cpus: [{date: this.now, percentage: 20, value: 2}],
        mem: [{date: this.now, percentage: 60, value: 6}],
        disk: [{date: this.now, percentage: 20, value: 2}]
      };

      expect(resources).toEqual(expectedResult);
    });

    it("filters by id", function () {
      let resources = this.list.getResourceStatesForServiceIDs([1]);
      let expectedResult = {
        cpus: [{date: this.now, percentage: 10, value: 1}],
        mem: [{date: this.now, percentage: 30, value: 3}],
        disk: [{date: this.now, percentage: 10, value: 1}]
      };

      expect(resources).toEqual(expectedResult);
    });

    it("filters by ids", function () {
      let resources = this.list.getResourceStatesForServiceIDs([1, 2]);
      let expectedResult = {
        cpus: [{date: this.now, percentage: 20, value: 2}],
        mem: [{date: this.now, percentage: 60, value: 6}],
        disk: [{date: this.now, percentage: 20, value: 2}]
      };

      expect(resources).toEqual(expectedResult);
    });

    it("computes all states and filters", function () {
      this.list.addSnapshot({
        frameworks: [
          {id: 1, used_resources: {cpus: 1, mem: 3, disk: 1}},
          {id: 2, used_resources: {cpus: 1, mem: 3, disk: 1}}
        ],
        slaves: [
          {resources: {cpus: 10, mem: 10, disk: 10}}
        ]
      }, this.now + 1);

      let resources = this.list.getResourceStatesForServiceIDs([1]);
      let expectedResult = {
        cpus: [
          {date: this.now, percentage: 10, value: 1},
          {date: this.now + 1, percentage: 10, value: 1}
        ],
        mem: [
          {date: this.now, percentage: 30, value: 3},
          {date: this.now + 1, percentage: 30, value: 3}
        ],
        disk: [
          {date: this.now, percentage: 10, value: 1},
          {date: this.now + 1, percentage: 10, value: 1}
        ]
      };

      expect(resources).toEqual(expectedResult);
    });

  });

  describe("#getResourceStatesForNodeIDs", function () {

    beforeEach(function () {
      this.now = Date.now();
      this.list = new SummaryList();
      this.list.addSnapshot({
        slaves: [
          {
            id: 1,
            resources: {cpus: 5, mem: 5, disk: 5},
            used_resources: {cpus: 1, mem: 3, disk: 1}
          },
          {
            id: 2,
            resources: {cpus: 5, mem: 5, disk: 5},
            used_resources: {cpus: 1, mem: 3, disk: 1}
          }
        ]
      }, this.now);
    });

    it("returns empty resource lists", function () {
      let list = new SummaryList();
      let resources = list.getResourceStatesForNodeIDs();
      expect(resources).toEqual({cpus: [], mem: [], disk: []});
    });

    it("doesn't filter by ids", function () {
      let resources = this.list.getResourceStatesForNodeIDs();
      let expectedResult = {
        cpus: [{date: this.now, percentage: 20, value: 2}],
        mem: [{date: this.now, percentage: 60, value: 6}],
        disk: [{date: this.now, percentage: 20, value: 2}]
      };

      expect(resources).toEqual(expectedResult);
    });

    it("filters by id", function () {
      let resources = this.list.getResourceStatesForNodeIDs([1]);
      let expectedResult = {
        cpus: [{date: this.now, percentage: 10, value: 1}],
        mem: [{date: this.now, percentage: 30, value: 3}],
        disk: [{date: this.now, percentage: 10, value: 1}]
      };

      expect(resources).toEqual(expectedResult);
    });

    it("filters by ids", function () {
      let resources = this.list.getResourceStatesForNodeIDs([1, 2]);
      let expectedResult = {
        cpus: [{date: this.now, percentage: 20, value: 2}],
        mem: [{date: this.now, percentage: 60, value: 6}],
        disk: [{date: this.now, percentage: 20, value: 2}]
      };

      expect(resources).toEqual(expectedResult);
    });

    it("computes all states and filters", function () {
      this.list.addSnapshot({
        slaves: [
          {
            id: 1,
            resources: {cpus: 10, mem: 10, disk: 10},
            used_resources: {cpus: 1, mem: 3, disk: 1}
          },
          {
            id: 2,
            resources: {cpus: 10, mem: 10, disk: 10},
            used_resources: {cpus: 1, mem: 3, disk: 1}
          }
        ]
      }, this.now + 1);

      let resources = this.list.getResourceStatesForNodeIDs([1]);
      let expectedResult = {
        cpus: [
          {date: this.now, percentage: 10, value: 1},
          {date: this.now + 1, percentage: 5, value: 1}
        ],
        mem: [
          {date: this.now, percentage: 30, value: 3},
          {date: this.now + 1, percentage: 15, value: 3}
        ],
        disk: [
          {date: this.now, percentage: 10, value: 1},
          {date: this.now + 1, percentage: 5, value: 1}
        ]
      };

      expect(resources).toEqual(expectedResult);
    });

  });

});
