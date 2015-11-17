jest.dontMock("../ArrayUtil");

var ArrayUtil = require("../ArrayUtil");

describe("ArrayUtil", function () {
  describe("#isArray", function () {
    it("should return true if passed an array", function () {
      var result = ArrayUtil.isArray([]);

      expect(result).toEqual(true);
    });

    it("should return false if passed arguments", function () {
      var result = ArrayUtil.isArray(arguments);

      expect(result).toEqual(false);
    });

    it("should return false if passed null", function () {
      var result = ArrayUtil.isArray(null);

      expect(result).toEqual(false);
    });

    it("should return false if passed undefined", function () {
      var result = ArrayUtil.isArray(undefined);

      expect(result).toEqual(false);
    });

    it("should return false if passed NaN", function () {
      var result = ArrayUtil.isArray(NaN);

      expect(result).toEqual(false);
    });

    it("should return false if passed an object (not an array)", function () {
      var result = ArrayUtil.isArray({});

      expect(result).toEqual(false);
    });

    it("should return false if passed a boolean", function () {
      var result = ArrayUtil.isArray(true);

      expect(result).toEqual(false);
    });

    it("should return false if passed an integer", function () {
      var result = ArrayUtil.isArray(100);

      expect(result).toEqual(false);
    });

    it("should return false if passed an string", function () {
      var result = ArrayUtil.isArray("foo");

      expect(result).toEqual(false);
    });
  });
});
