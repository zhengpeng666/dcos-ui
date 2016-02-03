jest.dontMock('../Util');

var Util = require('../Util');

describe('Util', function () {
  describe('#isArray', function () {
    it('should return true if passed an array', function () {
      var result = Util.isArray([]);

      expect(result).toEqual(true);
    });

    it('should return false if passed arguments', function () {
      var result = Util.isArray(arguments);

      expect(result).toEqual(false);
    });

    it('should return false if passed null', function () {
      var result = Util.isArray(null);

      expect(result).toEqual(false);
    });

    it('should return false if passed undefined', function () {
      var result = Util.isArray(undefined);

      expect(result).toEqual(false);
    });

    it('should return false if passed NaN', function () {
      var result = Util.isArray(NaN);

      expect(result).toEqual(false);
    });

    it('should return false if passed an object (not an array)', function () {
      var result = Util.isArray({});

      expect(result).toEqual(false);
    });

    it('should return false if passed a boolean', function () {
      var result = Util.isArray(true);

      expect(result).toEqual(false);
    });

    it('should return false if passed an integer', function () {
      var result = Util.isArray(100);

      expect(result).toEqual(false);
    });

    it('should return false if passed an string', function () {
      var result = Util.isArray('foo');

      expect(result).toEqual(false);
    });
  });

  describe('#throttleScroll', function () {
    beforeEach(function () {
      this.func = jest.genMockFunction();
      this.throttled = Util.throttleScroll(
        this.func, 200
      ).bind(this, {nativeEvent: {}});
    });

    it('only calls once if called before the wait is finished', function () {
      this.throttled();
      this.throttled();
      this.throttled();
      this.throttled();
      expect(this.func.mock.calls.length).toBe(1);
    });

    it('calls the function if called after the wait', function () {
      var throttled = this.throttled;
      var func = this.func;

      throttled();
      throttled();
      throttled();
      jest.runAllTimers();

      // The calls should be two because #throttleScroll will remember if it
      // was called during the wait and will invoke itself immediately once the
      // wait is over.
      expect(func.mock.calls.length).toBe(2);
    });
  });
});
