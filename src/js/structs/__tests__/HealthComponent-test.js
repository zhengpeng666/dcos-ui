jest.dontMock('../../constants/ComponentHealthStatus');

var ComponentHealthStatus = require('../../constants/ComponentHealthStatus');
var HealthComponent = require('../HealthComponent');

describe('HealthComponent', function () {

  describe('#getHealth', function () {

    it('returns a ComponentHealthStatus object', function () {
      var healthItem = new HealthComponent({
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
      var healthItem = new HealthComponent({});
      expect(healthItem.getHealth()).toEqual(ComponentHealthStatus.NA);
    });

  });

});
