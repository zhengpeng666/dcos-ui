jest.dontMock("../SummaryList");
jest.dontMock("../StateSummary");

let SummaryList = require("../SummaryList");
let StateSummary = require("../StateSummary");

describe("SummaryList", function () {

  describe("#constructor", function () {

    it("defaults the list to an empty array", function () {
      let list = new SummaryList();
      expect(list.getItems()).toEqual([]);
    });

    it("accepts a list of items", function () {
      let list = new SummaryList({items: [0, 1, 2]});
      expect(list.getItems()).toEqual([0, 1, 2]);
    });

    it("throws when initialized with a non-array argument", function () {
      let fn = function () {
        return new SummaryList({items: "foo"});
      };

      expect(fn).toThrow();
    });

  });

  describe("#add", function () {

    it("adds an item", function () {
      let list = new SummaryList();
      list.add(0);
      expect(list.getItems()).toEqual([0]);
    });

    it("adds two items", function () {
      let list = new SummaryList();
      list.add(0);
      list.add(1);
      expect(list.getItems()).toEqual([0, 1]);
    });

    it("adds items to current list", function () {
      let list = new SummaryList({items: [0]});
      list.add(1);
      list.add(2);
      expect(list.getItems()).toEqual([0, 1, 2]);
    });

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

  describe("#getItems", function () {

    it("returns list", function () {
      let list = new SummaryList();
      expect(list.getItems()).toEqual([]);
    });

    it("returns added items in a list", function () {
      let list = new SummaryList();
      list.add(0);
      list.add(1);
      expect(list.getItems()).toEqual([0, 1]);
    });

  });

  describe("#last", function () {

    it("returns nil when there's no last item", function () {
      let list = new SummaryList();
      expect(list.last()).toEqual(null);
    });

    it("returns the last item in the list", function () {
      let list = new SummaryList({items: [0, 1, 2, 3]});
      expect(list.last()).toEqual(3);
    });

  });

});
