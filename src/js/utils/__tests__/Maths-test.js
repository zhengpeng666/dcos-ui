jest.dontMock("../Maths");

describe("Maths", function () {
  var Maths = require("../Maths");

  describe("#round", function () {

    it("should round", function () {
      var value = Maths.round(1.9);
      expect(value).toBe(2);
    });

    it("should round on given precision", function () {
      var value = Maths.round(1.989, 2);
      expect(value).toBe(1.99);
    });

    it("should return 0 with a non number", function () {
      var value = Maths.round(null);
      expect(value).toBe(0);
    });

  });

});
