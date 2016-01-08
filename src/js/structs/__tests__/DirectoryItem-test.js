jest.dontMock("../DirectoryItem");

let DirectoryItem = require("../DirectoryItem");

describe("DirectoryItem", function () {

  describe("#isDirectory", function () {

    it("returns false when nlink is not present", function () {
      let file = new DirectoryItem({});
      expect(file.isDirectory()).toEqual(false);
    });

    it("returns false when nlink is 1 or below", function () {
      let file = new DirectoryItem({nlink: 1});
      expect(file.isDirectory()).toEqual(false);
    });

    it("returns false when nlink is 2 or above", function () {
      let file = new DirectoryItem({nlink: 2});
      expect(file.isDirectory()).toEqual(true);
    });

  });

});
