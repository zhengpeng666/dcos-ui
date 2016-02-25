jest.dontMock('../../constants/UnitHealthStatus');

var _ = require('underscore');
var HealthUnit = require('../../structs/HealthUnit');
var UnitHealthStatus = require('../../constants/UnitHealthStatus');
var UnitHealthUtil = require('../../utils/UnitHealthUtil');
let NodesList = require('../../structs/NodesList');

describe('UnitHealthUnit', function () {

  describe('#getHealthSortFunction', function () {
    beforeEach(function () {
      this.sortHealthFunction = UnitHealthUtil.getHealthSortFunction();
      this.item_a = new HealthUnit({unit_health: 0, unit_id: 'aaa'});
      this.item_b = new HealthUnit({unit_health: 0, unit_id: 'bbb'});
      this.item_c = new HealthUnit({unit_health: 1, unit_id: 'ccc'});
    });

    it('should return a function', function () {
      expect(_.isFunction(this.sortHealthFunction)).toEqual(true);
    });

    it('should compare healths', function () {
      var sortFunction = this.sortHealthFunction();
      expect(sortFunction(this.item_a, this.item_c)).toEqual(1);
      expect(sortFunction(this.item_c, this.item_a)).toEqual(-1);
    });

    it('should compare against tieBreakKey if health is the same',
      function () {
        var key = 'unit_id';
        var sortFunction = this.sortHealthFunction(key);
        expect(sortFunction(this.item_a, this.item_b)).toEqual(-1);
        expect(sortFunction(this.item_b, this.item_a)).toEqual(1);
      }
    );

  });

  describe('#getHealth', function () {

    it('returns a UnitHealthStatus object', function () {
      var health = 1;

      expect(UnitHealthUtil.getHealth(health)).toEqual({
        title: 'Unhealthy',
        value: 1,
        classNames: 'text-danger'
      });
    });

    it('returns NA when health not valid', function () {
      var health = 'wtf';
      expect(UnitHealthUtil.getHealth(health)).toEqual(UnitHealthStatus.NA);
    });

  });

  describe('#filterByHealth', function () {

    it('filters by unit health title', function () {
      let items = [
        {id: 'food', node_health: 0},
        {id: 'bard', node_health: 0},
        {id: 'bluh', node_health: 2}
      ];
      let list = new NodesList({items});
      let filteredList = list.filter({health: 'healthy'}).getItems();
      expect(filteredList.length).toEqual(2);
      expect(filteredList[0].get('id')).toEqual('food');
      expect(filteredList[1].get('id')).toEqual('bard');
    });
  });

});
