const Item = require('../Item');

describe('Item', function () {

  describe('#constructor', function () {

    it('sets object properties as instance properties', function () {
      let item = new Item({a: 1, b: 2});
      expect(item.a).toEqual(1);
      expect(item.b).toEqual(2);
    });

  });

  describe('#get', function () {

    it('returns undefined for non existent properties', function () {
      let item = new Item();
      expect(item.get('foo')).toEqual(undefined);
    });

    it('returns property when it exists', function () {
      let item = new Item({foo: 'bar'});
      expect(item.get('foo')).toEqual('bar');
    });

    it('returns all properties when no key is defined', function () {
      let item = new Item({foo: 'bar', baz: 'qux'});
      expect(item.get()).toEqual({foo: 'bar', baz: 'qux'});
    });

  });

  describe('#getPruned', function () {

    it('returns properly pruned undefined & null values', function () {
      let item = new Item({
        a: true,
        b: false,
        c: 0,
        d: null,
        e: undefined
      });
      expect(item.getPruned()).toEqual({
        a: true,
        b: false,
        c: 0
      });
    });

    it('returns properly pruned custom values', function () {
      let item = new Item({
        a: true,
        b: false,
        c: 0,
        d: null,
        e: undefined
      });
      expect(item.getPruned(null, [true, false])).toEqual({
        c: 0,
        d: null,
        e: undefined
      });
    });

    it('returns properly pruned children', function () {
      let item = new Item({
        a: {
          b: [
            null,
            undefined,
            {
              d: null,
              e: false,
              f: 0,
              g: {
                h: null
              }
            }
          ],
          c: null
        }
      });
      expect(item.getPruned()).toEqual({
        a: {
          b: [
            {
              e: false,
              f: 0,
              g: { }
            }
          ]
        }
      });
    });
  });

});
