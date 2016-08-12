var DataObject = require('../DataObject');

class CustomClass extends DataObject {
  constructor() {
    super(...arguments);
    this.createAccessorFor('a').as('a');
    this.createAccessorFor('b').as('b');
  }
}

describe('DataObject', function () {

  describe('#createAccessorFor', function () {

    it('should read data correctly through accessor', function () {
      let data = { 'primitive': 123, 'ref': { 'a': 1, 'b': 2 } };
      let item = new DataObject(data);

      item.createAccessorFor('primitive').as('prop_1');
      item.createAccessorFor('ref.a').as('prop_2');

      expect(item.prop_1).toEqual(123);
      expect(item.prop_2).toEqual(1);
    });

    it('should update data correctly through accessor', function () {
      let data = { 'primitive': 123, 'ref': { 'a': 1, 'b': 2 } };
      let item = new DataObject(data);

      item.createAccessorFor('primitive').as('prop_1');
      item.createAccessorFor('ref.a').as('prop_2');

      item.prop_1 = 456;
      item.prop_2 = 'b';

      expect(item.prop_1).toEqual(456);
      expect(item.prop_2).toEqual('b');

      expect(data.primitive).toEqual(456);
      expect(data.ref.a).toEqual('b');
    });

    it('should return correct management classes', function () {
      let data = { 'primitive': 123, 'ref': { 'a': 1, 'b': 2 } };
      let item = new DataObject(data);

      item.createAccessorFor('ref').withClass(CustomClass).as('ref');

      expect(item.ref instanceof CustomClass).toBeTruthy();
      expect(item.ref.a).toEqual(1);
      expect(item.ref.b).toEqual(2);
    });

    it('should update data correctly when assigning managed class', function () {
      let data = { 'primitive': 123, 'ref': { 'a': 1, 'b': 2 } };
      let item = new DataObject(data);

      item.createAccessorFor('ref').withClass(CustomClass).as('ref');

      let ref = new CustomClass();
      ref.a = 2;
      ref.b = '3';

      item.ref = ref;
      expect(data.ref.a).toEqual(2);
      expect(data.ref.b).toEqual('3');
    });

    it('should properly keep refernces when using management classes', function () {
      let data = { 'primitive': 123, 'ref': { 'a': 1, 'b': 2 } };
      let item = new DataObject(data);

      item.createAccessorFor('ref').withClass(CustomClass).as('ref');
      let ref = item.ref;

      ref.a = 2;
      ref.b = '3';

      expect(item.ref.a).toEqual(2);
      expect(item.ref.b).toEqual('3');
    });

    it('should properly return arrays of managed classes', function () {
      let data = { 'ref': [{ 'a': 1, 'b': 2 }, { 'a': 3, 'b': 4 }] };
      let item = new DataObject(data);

      item.createAccessorFor('ref').withClass(CustomClass).andArrayManagement().as('ref');

      expect(Array.isArray(item.ref)).toBeTruthy();

      expect(item.ref[0] instanceof CustomClass).toBeTruthy();
      expect(item.ref[0].a).toEqual(1);
      expect(item.ref[0].b).toEqual(2);

      expect(item.ref[1] instanceof CustomClass).toBeTruthy();
      expect(item.ref[1].a).toEqual(3);
      expect(item.ref[1].b).toEqual(4);
    });

    it('should properly update arrays of managed classes', function () {
      let data = { 'ref': [{ 'a': 1, 'b': 2 }] };
      let item = new DataObject(data);

      item.createAccessorFor('ref').withClass(CustomClass).andArrayManagement().as('ref');

      let ref = new CustomClass();
      ref.a = 3;
      ref.b = 4;

      item.ref.push( ref );

      expect(data.ref[1] instanceof CustomClass).toBeFalsy();
      expect(data.ref[1].a).toEqual(3);
      expect(data.ref[1].b).toEqual(4);
    });

  });

  describe('#get', function () {

    it('should get values through get', function () {
      let data = { 'primitive': 123, 'ref': { 'a': 1, 'b': 2 } };
      let item = new DataObject(data);

      expect(item.get('primitive')).toEqual(123);
      expect(item.get('ref.a')).toEqual(1);
      expect(item.get('ref.b')).toEqual(2);
      expect(item.get('invalid')).toEqual(undefined);
    });

  });

  describe('#set', function () {

    it('should update values through set', function () {
      let data = { 'primitive': 123, 'ref': { 'a': 1, 'b': 2 } };
      let item = new DataObject(data);

      item.set('primitive', 456);
      item.set('ref.a', 3);
      item.set('ref.b', 4);

      expect(item.__data.primitive).toEqual(456);
      expect(item.__data.ref.a).toEqual(3);
      expect(item.__data.ref.b).toEqual(4);
    });

  });

  describe('#remove', function () {

    it('should delete values through remove', function () {
      let data = { 'primitive': 123, 'ref': { 'a': 1, 'b': 2 } };
      let item = new DataObject(data);

      item.remove('primitive', 456);
      item.remove('ref.a', 3);

      expect(item.__data.primitive).toEqual(undefined);
      expect(item.__data.ref.a).toEqual(undefined);
      expect(item.__data.ref.b).toEqual(2);
    });

  });

  describe('#toJSON', function () {

    it('should properly stringify to json', function () {
      let data = { 'primitive': 123, 'ref': { 'a': 1, 'b': 2 } };
      let item = new DataObject(data);

      expect(JSON.stringify(item)).toEqual('{"primitive":123,"ref":{"a":1,"b":2}}');
    });

  });

});
