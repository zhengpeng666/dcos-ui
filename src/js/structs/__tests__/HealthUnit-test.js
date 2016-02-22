jest.dontMock('../../constants/UnitHealthStatus');

var UnitHealthStatus = require('../../constants/UnitHealthStatus');
var HealthUnit = require('../HealthUnit');

describe('HealthUnit', function () {

  describe('#getHealth', function () {

    it('returns a UnitHealthStatus object', function () {
      var healthItem = new HealthUnit({
        'id': 'service_manager',
        'name': 'Service Manager',
        'version': '0.0.1',
        'health': 1
      });

      expect(healthItem.getHealth()).toEqual({
        title: 'Healthy',
        value: 1,
        classNames: 'text-success'
      });
    });

    it('returns NA when healthType not found', function () {
      var healthItem = new HealthUnit({});
      expect(healthItem.getHealth()).toEqual(UnitHealthStatus.NA);
    });

  });

});
