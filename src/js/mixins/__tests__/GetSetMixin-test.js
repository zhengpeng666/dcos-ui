jest.dontMock("../GetSetMixin");

var _ = require("underscore");
var GetSetMixin = require("../GetSetMixin");

describe("GetSetMixin", function () {

  beforeEach(function () {
    this.instance = _.extend({}, GetSetMixin);
  });

  describe("#get", function () {

    it("should return undefined if no key is given", function () {
      expect(this.instance.get()).toEqual(undefined);
    });

    it("should return undefined if given an object", function () {
      expect(this.instance.get({})).toEqual(undefined);
    });

    it("should return the correct value given a key", function () {
      var instance = this.instance;
      instance.set({someProperty: "someValue"});
      expect(this.instance.get("someProperty")).toEqual("someValue");
    });

  });

  describe("#set", function () {

    it("should throw an error when trying to set with a non-object", function () {
      var instance = this.instance;
      var fn = instance.set.bind(instance, null);

      expect(fn).toThrow();
    });

    it("should only set the given properties", function () {
      var instance = this.instance;

      instance.set({a: 1, b: 2, c: 3});

      instance.set({a: "a", b: "b"});

      expect(instance.get("a")).toEqual("a");
      expect(instance.get("b")).toEqual("b");
      expect(instance.get("c")).toEqual(3);
    });

  });

});
