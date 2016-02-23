jest.dontMock('../../constants/UnitHealthStatus');

var UnitHealthStatus = require('../../constants/UnitHealthStatus');
var HealthUnit = require('../HealthUnit');

describe('HealthUnit', function () {

  describe('#getHealth', function () {

    it('returns a UnitHealthStatus object', function () {
      var healthItem = new HealthUnit({
        'unit_id': 'service_manager',
        'unit_title': 'Service Manager',
        'unit_health': 1
      });

      expect(healthItem.getHealth()).toEqual({
        title: 'Unhealthy',
        value: 1,
        classNames: 'text-danger'
      });
    });

    it('returns NA when healthType not found', function () {
      var healthItem = new HealthUnit({});
      expect(healthItem.getHealth()).toEqual(UnitHealthStatus.NA);
    });

  });

});
