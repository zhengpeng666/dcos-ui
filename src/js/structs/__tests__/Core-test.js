
var Core = require('../Core');
var CompositeState = require('../CompositeState');

describe('Core', function () {

  beforeEach(function () {
    CompositeState.constructor({});
    Core.summary.list = [];
  });

  describe('#addState', function () {

    it('adds an object to state', function () {
      Core.addState({foo: 'bar'});
      expect(CompositeState.data).toEqual({foo: 'bar'});
    });

    it('merges old and new states', function () {
      Core.addState({foo: 'bar'});
      Core.addState({baz: 'qux'});
      expect(CompositeState.data).toEqual({foo: 'bar', baz: 'qux'});
    });

    it('merges old and new states, overwriting old with new', function () {
      Core.addState({foo: 'bar'});
      Core.addState({baz: 'qux'});
      Core.addState({foo: 'baz'});
      expect(CompositeState.data).toEqual({foo: 'baz', baz: 'qux'});
    });

  });

  describe('#addMarathon', function () {

    it('adds properties to an existing framework', function () {
      Core.addState({
        frameworks: [{
          id: 'foo-id',
          name: 'foo',
          bar: 'baz'
        }]
      });

      Core.addMarathon({
        foo: {
          baz: 'bar'
        }
      });

      expect(CompositeState.data).toEqual({
        frameworks: [{
          id: 'foo-id',
          name: 'foo',
          bar: 'baz',
          _meta: {
            marathon: {
              baz: 'bar'
            }
          }
        }]
      });
    });

  });

  describe('#addSummary', function () {

    it('adds a summary snapshot', function () {
      Core.addSummary({
        frameworks: [{foo: 'bar'}],
        slaves: [{bar: 'baz'}],
        cluster: 'qux',
        hostname: 'corge'
      });

      expect(Core.summary.list[0].snapshot).toEqual({
        frameworks: [{foo: 'bar'}],
        slaves: [{bar: 'baz'}],
        cluster: 'qux',
        hostname: 'corge'
      });
    });

    it('updates the composite state', function () {
      Core.addSummary({
        frameworks: [{id: 'foo', foo: 'bar'}],
        slaves: [{id: 'corge', bar: 'baz'}],
        cluster: 'qux',
        hostname: 'corge'
      });

      expect(CompositeState.data).toEqual({
        frameworks: [{id: 'foo', foo: 'bar'}],
        slaves: [{id: 'corge', bar: 'baz'}],
        cluster: 'qux',
        hostname: 'corge'
      });
    });

    it('adds multiple summary snapshots', function () {
      Core.addSummary({
        frameworks: [{id: 'foo', foo: 'bar'}],
        slaves: [{id: 'corge', bar: 'baz'}],
        cluster: 'qux',
        hostname: 'corge'
      });
      Core.addSummary({
        frameworks: [{id: 'bar', foo: 'bar'}],
        slaves: [{id: 'corge', bar: 'baz'}],
        cluster: 'qux',
        hostname: 'corge'
      });

      expect(Core.summary.list.length).toEqual(2);
    });

  });

  describe('#getLatest', function () {

    it('returns the current state as a composite object of all objects',
      function () {
        Core.addSummary({
          frameworks: [{id: 'foo', foo: 'bar'}],
          slaves: [{id: 'corge', bar: 'baz'}]
        });

        Core.addSummary({
          frameworks: [{id: 'foo', foo: 'bar'}],
          slaves: [{id: 'corge', bar: 'baz'}],
          cluster: 'qux',
          hostname: 'corge'
        });

        expect(Core.getLatest()).toEqual({
          data: {
            frameworks: [{id: 'foo', foo: 'bar'}],
            slaves: [{id: 'corge', bar: 'baz'}],
            cluster: 'qux',
            hostname: 'corge'
          }
        });
      });

  });

});
