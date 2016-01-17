jest.dontMock('../../utils/Util');

let List = require('../List');

describe('List', function () {

  describe('#constructor', function () {

    it('defaults the list to an empty array', function () {
      let list = new List();
      expect(list.getItems()).toEqual([]);
    });

    it('accepts a list of items', function () {
      let list = new List({items: [0, 1, 2]});
      expect(list.getItems()).toEqual([0, 1, 2]);
    });

    it('throws when initialized with a non-array argument', function () {
      let fn = function () {
        return new List({items: 'foo'});
      };

      expect(fn).toThrow();
    });

  });

  describe('#add', function () {

    it('adds an item', function () {
      let list = new List();
      list.add(0);
      expect(list.getItems()).toEqual([0]);
    });

    it('adds two items', function () {
      let list = new List();
      list.add(0);
      list.add(1);
      expect(list.getItems()).toEqual([0, 1]);
    });

    it('adds items to current list', function () {
      let list = new List({items: [0]});
      list.add(1);
      list.add(2);
      expect(list.getItems()).toEqual([0, 1, 2]);
    });

  });

  describe('#getItems', function () {

    it('returns list', function () {
      let list = new List();
      expect(list.getItems()).toEqual([]);
    });

    it('returns added items in a list', function () {
      let list = new List();
      list.add(0);
      list.add(1);
      expect(list.getItems()).toEqual([0, 1]);
    });

  });

  describe('#last', function () {

    it('returns nil when there\'s no last item', function () {
      let list = new List();
      expect(list.last()).toEqual(null);
    });

    it('returns the last item in the list', function () {
      let list = new List({items: [0, 1, 2, 3]});
      expect(list.last()).toEqual(3);
    });

  });

});
