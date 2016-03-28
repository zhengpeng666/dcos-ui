jest.dontMock('../../constants/HealthSorting');
jest.dontMock('../ResourceTableUtil');

var _ = require('underscore');
var MarathonStore = require('../../stores/MarathonStore');
var ResourceTableUtil = require('../ResourceTableUtil');

describe('ResourceTableUtil', function () {
  beforeEach(function () {
    this.getServiceHealth = MarathonStore.getServiceHealth;
    MarathonStore.getServiceHealth = function (prop) {
      return this[prop].health;
    }.bind(this);

    this.foo = {
      name: 'foo',
      statuses: [{timestamp: 1}, {timestamp: 2}],
      updated: 0,
      health: {key: 'UNHEALTHY'},
      resources: {
        cpus: 100,
        mem: [{value: 2}, {value: 3}]
      }
    };
    this.bar = {
      name: 'bar',
      statuses: [{timestamp: 4}],
      updated: 1,
      health: {key: 'HEALTHY'},
      resources: {
        cpus: 5,
        mem: [{value: 0}, {value: 1}]
      }
    };
  });

  afterEach(function () {
    MarathonStore.getServiceHealth = this.getServiceHealth;
  });

  describe('#getSortFunction', function () {
    beforeEach(function () {
      this.sortFunction = ResourceTableUtil.getSortFunction('name');
    });

    it('should return a function', function () {
      expect(_.isFunction(this.sortFunction)).toEqual(true);
    });

    it('should compare the most recent timestamps when prop is updated',
      function () {
        var sortFunction = this.sortFunction('updated');
        expect(sortFunction(this.foo, this.bar))
          .toEqual(2 - 4);
      }
    );

    it('should compare baseProp values', function () {
      var sortFunction = this.sortFunction('name');

      // 'foo' > 'bar' will equal true and compareValues returns 1
      expect(sortFunction(this.foo, this.bar)).toEqual(1);
    });

    it('should compare the health correctly', function () {
      var sortFunction = this.sortFunction('health');
      expect(sortFunction(this.foo, this.bar)).toEqual(-1);
    });

    it('should use the baseProp if health is the same', function () {
      var prevHealth = this.bar.health.key;
      this.bar.health.key = this.foo.health.key;
      var sortFunction = this.sortFunction('health');

      // Will compare with names now: 'foo' > 'bar' which will return 1
      expect(sortFunction(this.foo, this.bar)).toEqual(1);

      // Set it back to original health
      this.bar.health.key = prevHealth;
    });

    it('should return a function', function () {
      expect(_.isFunction(this.sortFunction)).toEqual(true);
    });

    it('should compare resource values', function () {
      var sortFunction = this.sortFunction('cpus');
      expect(sortFunction(this.foo, this.bar)).toEqual(100 - 5);
    });

    it('should compare last resource values', function () {
      var sortFunction = this.sortFunction('mem');
      expect(sortFunction(this.foo, this.bar)).toEqual(3 - 1);
    });
  });
});
