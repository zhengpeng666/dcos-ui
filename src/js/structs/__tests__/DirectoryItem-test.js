jest.dontMock("../File");

let File = require("../File");

describe("File", function () {

  describe("#isDirectory", function () {

    it("returns false when nlink is not present", function () {
      let file = new File({});
      expect(file.isDirectory()).toEqual(false);
    });

    it("returns false when nlink is 1 or below", function () {
      let file = new File({nlink: 1});
      expect(file.isDirectory()).toEqual(false);
    });

    it("returns false when nlink is 2 or above", function () {
      let file = new File({nlink: 2});
      expect(file.isDirectory()).toEqual(true);
    });

  });

});
