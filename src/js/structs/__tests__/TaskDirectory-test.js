jest.dontMock("../File");
jest.dontMock("../TaskDirectory");
jest.dontMock("../../utils/Util");

let File = require("../File");
let TaskDirectory = require("../TaskDirectory");

describe("TaskDirectory", function () {

  beforeEach(function () {
    let items = [{path: "/some/path/to/bar"}];
    this.directory = new TaskDirectory({items});
  });

  describe("#constructor", function () {

    it("creates instances of File", function () {
      let items = this.directory.getItems();
      expect(items[0] instanceof File).toBeTruthy();
    });

  });

  describe("#getFileForName", function () {

    it("should return undefined when item is not is list", function () {
      expect(this.directory.getFileForName("quis")).toEqual(undefined);
    });

    it("should return the file when item is not is list", function () {
      expect(this.directory.getFileForName("bar").get("path"))
        .toEqual("/some/path/to/bar");
    });

  });

});
