jest.dontMock("../Maths");

var Maths = require("../Maths");

describe("Maths", function () {

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

  describe("#mapValue", function () {

    it("should return min if there is no range", function () {
      var value = Maths.mapValue(1, {min: 1, max: 1});
      expect(value).toEqual(1);
    });

    it("should return undefined with a non number", function () {
      var value = Maths.mapValue(NaN, {min: 0, max: 10});
      expect(typeof value).toEqual("undefined");
    });

    it("should return a number", function () {
      var value = Maths.mapValue(5, {min: 0, max: 10});
      expect(typeof value).toEqual("number");
    });

    it("should map correctly", function () {
      var value = Maths.mapValue(5, {min: 0, max: 10});
      expect(value).toEqual(0.5);
    });

    it("should map correctly", function () {
      var value = Maths.mapValue(2.5, {min: 0, max: 10});
      expect(value).toEqual(0.25);
    });

  });

  describe("#unmapValue", function () {

    it("should return undefined with a non number", function () {
      var value = Maths.unmapValue(NaN, {min: 0, max: 10});
      expect(typeof value).toEqual("undefined");
    });

    it("should return a number", function () {
      var value = Maths.unmapValue(0.5, {min: 0, max: 10});
      expect(typeof value).toEqual("number");
    });

    it("should map correctly", function () {
      var value = Maths.unmapValue(0.5, {min: 0, max: 10});
      expect(value).toEqual(5);
    });

    it("should map correctly", function () {
      var value = Maths.unmapValue(0.25, {min: 0, max: 10});
      expect(value).toEqual(2.5);
    });

  });

});
