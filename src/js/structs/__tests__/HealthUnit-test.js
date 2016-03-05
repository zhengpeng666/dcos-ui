jest.dontMock('../../constants/UnitHealthStatus');

var HealthUnit = require('../HealthUnit');
var UnitHealthStatus = require('../../constants/UnitHealthStatus');

describe('HealthUnit', function () {

  describe('#getHealth', function () {

    it('returns a UnitHealthStatus object', function () {
      var healthItem = new HealthUnit({
        'id': 'service_manager',
        'description': 'Service Manager',
        'health': 1
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
