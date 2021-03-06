const Batch = require('../Batch');
const Transaction = require('../Transaction');

describe('Batch', function () {
  beforeEach(function () {
    this.batch = new Batch();
  });

  describe('#add', function () {

    it('should not throw an error', function () {
      expect(() => {
        this.batch.add(new Transaction(['foo'], 'test'));
      }).not.toThrow();
    });

  });

  describe('#reduce', function () {

    it('should iterate correctly over a batch with 1 item', function () {
      this.batch.add(new Transaction(['foo'], 'a'));
      let values = this.batch.reduce(function (values, item) {
        values.push(item.value);

        return values;
      }, []);

      expect(values).toEqual(['a']);
    });

    it('should iterate correctly over a batch with 3 item', function () {
      this.batch.add(new Transaction(['foo'], 'a'));
      this.batch.add(new Transaction(['bar'], 'b'));
      this.batch.add(new Transaction(['baz'], 'c'));
      let values = this.batch.reduce(function (values, item) {
        values.push(item.value);

        return values;
      }, []);

      expect(values).toEqual(['a', 'b', 'c']);
    });

    it('should run reducers at least once', function () {
      let sum = this.batch.reduce(function (sum) {
        return sum + 1;
      }, 0);

      expect(sum).toEqual(1);
    });

    it('should pass sane arguments for reducing on empty batch', function () {
      let args = this.batch.reduce(function (sum, action, index) {
        return [sum, action, index];
      }, 'initial');

      expect(args).toEqual(['initial', {value: 'INIT'}, 0]);
    });

    it('should not run reducers more than number than values', function () {
      this.batch.add(new Transaction(['foo'], 'a'));
      this.batch.add(new Transaction(['bar'], 'b'));
      this.batch.add(new Transaction(['baz'], 'c'));
      let sum = this.batch.reduce(function (sum) {
        return sum + 1;
      }, 0);

      expect(sum).toEqual(3);
    });

    it('doesn\'t add action if last action with same path had same value', function () {
      this.batch.add(new Transaction(['foo', 'bar'], 'a'));
      this.batch.add(new Transaction(['foo', 'foo'], 'b'));
      this.batch.add(new Transaction(['foo', 'bar'], 'a'));
      this.batch.add(new Transaction(['foo', 'bar'], 'a'));
      let sum = this.batch.reduce(function (sum) {
        return sum + 1;
      }, 0);

      expect(sum).toEqual(3);
    });

    it('should keep all ', function () {
      this.batch.add(new Transaction(['id'], 'a'));
      this.batch.add(new Transaction(['cpu'], 1));
      this.batch.add(new Transaction(['id'], 'b'));
      this.batch.add(new Transaction(['mem'], 1));
      this.batch.add(new Transaction(['id'], 'a'));
      let sum = this.batch.reduce(function (sum) {
        return sum + 1;
      }, 0);

      expect(sum).toEqual(5);
    });

  });

});
