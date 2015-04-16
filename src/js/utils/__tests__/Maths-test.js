jest.dontMock("../Maths");

describe("Maths", function () {
  var Maths = require("../Maths");

  describe("#round", function () {

    it("should round", function () {
      var value = Maths.round(1.9);
      expect(value).toEqual(2);
    });

    it("should round on given precision", function () {
      var value = Maths.round(1.989, 2);
      expect(value).toEqual(1.99);
    });

    it("should return 0 with a non number", function () {
      var value = Maths.round(null);
      expect(value).toEqual(0);
    });

    it("leaves integers", function () {
      var value = Maths.round(123456, 4);
      expect(value).toEqual(123456);
    });

  });

  describe("#sum", function () {

    it("sums an array of numbers", function () {
      var total = Maths.sum([1, 2, 3, 4, 5, 6]);
      expect(total).toEqual(21);
    });

    it("sums nested arrays", function () {
      var total = Maths.sum([1, [2, 3], 4, [5], 6]);
      expect(total).toEqual(21);
    });

    it("sums deeply nested arrays", function () {
      var total = Maths.sum([1, [2, [3]], 4, [5], 6]);
      expect(total).toEqual(21);
    });

  });

  describe("#mean", function () {

    it("calculates the mean of an array", function () {
      var mean = Maths.mean([2, 2, 8]);
      expect(mean).toEqual(4);
    });

  });

});
