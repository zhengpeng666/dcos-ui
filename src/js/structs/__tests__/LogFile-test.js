jest.dontMock("../Item");
jest.dontMock("../List");
jest.dontMock("../LogFile");
jest.dontMock("../../utils/Util");

let Item = require("../Item");
let List = require("../List");
let LogFile = require("../LogFile");

const PAGE_SIZE = 8 * 4096; // 8 "pages"

describe("LogFile", function () {

  beforeEach(function () {
    this.logFile = new LogFile();
  });

  describe("#constructor", function () {

    it("creates instances of Item", function () {
      let logFile = new LogFile({items: [{foo: "bar"}]});
      let items = logFile.getItems();
      expect(items[0] instanceof Item).toBeTruthy();
    });

    it("uses default end option if nothing is provided", function () {
      expect(this.logFile.getEnd()).toEqual(-1);
    });

    it("uses default initialized option if nothing is provided", function () {
      expect(this.logFile.getInitialized()).toEqual(false);
    });

    it("uses default start option if nothing is provided", function () {
      expect(this.logFile.options.start).toEqual(-1);
    });

    it("uses default maxFileSize option if nothing is provided", function () {
      expect(this.logFile.options.maxFileSize).toEqual(5000);
    });

    it("uses default end option if nothing is provided", function () {
      this.logFile = new LogFile({end: 2000});
      expect(this.logFile.getEnd()).toEqual(2000);
    });

    it("uses default initialized option if nothing is provided", function () {
      this.logFile = new LogFile({initialized: true});
      expect(this.logFile.getInitialized()).toEqual(true);
    });

    it("uses default start option if nothing is provided", function () {
      this.logFile = new LogFile({start: 0});
      expect(this.logFile.options.start).toEqual(0);
    });

    it("uses default maxFileSize option if nothing is provided", function () {
      this.logFile = new LogFile({maxFileSize: 2000});
      expect(this.logFile.options.maxFileSize).toEqual(2000);
    });

  });

  describe("#add", function () {

    it("should call its super function", function () {
      this.originalAdd = List.prototype.add;
      List.prototype.add = jasmine.createSpy();

      this.logFile.add(new Item({data: "foo", offset: 100}));
      expect(List.prototype.add).toHaveBeenCalled();

      // Reset add to original
      List.prototype.add = this.originalAdd;
    });

    it("should add length to get new 'end' when beginning log", function () {
      this.logFile.add(new Item({data: "foo\nbar\nquis", offset: 100}));
      // 100 + "foo\nbar\nquis".indexOf("\n") + 1 + "bar\nquis".length
      expect(this.logFile.getEnd()).toEqual(100 + "foo\nbar\nquis".length);
    });

    it("should start log at first newline when beginning log", function () {
      this.logFile.add(new Item({data: "foo\nbar\nquis", offset: 100}));
      // 100 + "foo\nbar\nquis".indexOf("\n") + 1
      expect(this.logFile.options.start).toEqual(100 + 3 + 1);
    });

    it("should start log at end - maxFileSize when beginning log", function () {
      let logFile = new LogFile({maxFileSize: 10});
      logFile.add(new Item({
        data: "foo\nbarquisfoofoofoofoofoofoofoofoofoofoofoo\nfoo",
        offset: 100
      }));
      // 100 + "foo\nbar\nquisfoofoofoofoofoofoofoofoofoofoofoofoo".length -
      // "foo".length
      expect(logFile.options.start).toEqual(logFile.getEnd() - 3);
    });

    it("should add length to get new 'end' during logging", function () {
      this.logFile.add(new Item({data: "foo", offset: 100}));
      this.logFile.add(new Item({data: "\nbar\nquis", offset: 103}));
      expect(this.logFile.getEnd()).toEqual(103 + "\nbar\nquis".length);
    });

    it("should start log at first offset when file < maxFileSize", function () {
      this.logFile.add(new Item({data: "foo", offset: 100}));
      this.logFile.add(new Item({data: "\nbar\nquis", offset: 103}));
      expect(this.logFile.options.start).toEqual(100);
    });

    it("should start log at end - maxFileSize during logging", function () {
      let logFile = new LogFile({maxFileSize: 10});
      logFile.add(new Item({data: "foo", offset: 100}));
      logFile.add(new Item({
        data: "\nbarquisfoofoofoofoofoofoofoofoofoofoofoo\nfoo",
        offset: 103
      }));
      // 103 + "\nbar\nquisfoofoofoofoofoofoofoofoofoofoofoofoo".length -
      // "foo".length
      expect(logFile.options.start).toEqual(logFile.getEnd() - 3);
    });

  });

  describe("#truncate", function () {

    it("should cut the first item when not within maxFileSize", function () {
      let logFile = new LogFile({maxFileSize: 10});
      logFile.add(new Item({data: "foo", offset: 100}));
      logFile.add(new Item({data: "foo", offset: 103}));
      logFile.add(new Item({
        data: "\nbarquisfoofoofoofoofoofoofoofoofoofoofoo\nfoo",
        offset: 106
      }));

      expect(logFile.getItems().length).toEqual(1);
    });

    it("should keep all items when within maxFileSize", function () {
      let logFile = new LogFile({maxFileSize: 200});
      logFile.add(new Item({data: "foo", offset: 100}));
      logFile.add(new Item({data: "foo", offset: 103}));
      logFile.add(new Item({
        data: "\nbarquisfoofoofoofoofoofoofoofoofoofoofoo\nfoo",
        offset: 106
      }));

      expect(logFile.getItems().length).toEqual(3);
    });

  });

  describe("#initialize", function () {

    it("should set end to 0 if offset < PAGE_SIZE", function () {
      this.logFile.initialize(new Item({data: "foo", offset: 100}));
      expect(this.logFile.getEnd()).toEqual(0);
    });

    it("should set start to 0 if offset < PAGE_SIZE", function () {
      this.logFile.initialize(new Item({data: "foo", offset: 100}));
      expect(this.logFile.options.start).toEqual(0);
    });

    it("should set end to offset - PAGE_SIZE when > PAGE_SIZE", function () {
      this.logFile.initialize(new Item({data: "foo", offset: PAGE_SIZE + 100}));
      expect(this.logFile.getEnd()).toEqual(100);
    });

    it("should set start to offset - PAGE_SIZE when > PAGE_SIZE", function () {
      this.logFile.initialize(new Item({data: "foo", offset: PAGE_SIZE + 100}));
      expect(this.logFile.options.start).toEqual(100);
    });

  });

  describe("#getFullLog", function () {

    it("should return empty string when no items", function () {
      expect(this.logFile.getFullLog()).toEqual("");
    });

    it("should return data items when it holds items", function () {
      this.logFile.add(new Item({data: "foo", offset: 100}));
      this.logFile.add(new Item({data: "bar", offset: 103}));
      this.logFile.add(new Item({data: "quis", offset: 107}));
      expect(this.logFile.getFullLog()).toEqual("foobarquis");
    });

  });

});
