jest.dontMock("../InternalStorageMixin");

var _ = require("underscore");
var InternalStorageMixin = require("../InternalStorageMixin");

describe("InternalStorageMixin", function () {

  beforeEach(function () {
    this.instance = _.extend({}, InternalStorageMixin);
    this.instance.constructor.displayName = "FakeInstance";
  });

  it("should get the last set object", function () {
    var instance = this.instance;

    instance.internalStorage_set({
      a: 1,
      b: 2,
      c: 3
    });

    instance.internalStorage_set({
      a: "a",
      b: "b"
    });

    expect(instance.internalStorage_get()).toEqual({
      a: "a",
      b: "b"
    });
  });

  it("should get the updated object", function () {
    var instance = this.instance;

    instance.internalStorage_set({
      a: 1,
      b: 2,
      c: 3
    });

    instance.internalStorage_update({
      a: "a",
      b: "b"
    });

    expect(instance.internalStorage_get()).toEqual({
      a: "a",
      b: "b",
      c: 3
    });
  });

});
