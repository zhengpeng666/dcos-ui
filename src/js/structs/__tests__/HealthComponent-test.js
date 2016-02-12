jest.dontMock('../../constants/ComponentHealthTypes');

var ComponentHealthTypes = require('../../constants/ComponentHealthTypes');
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
        key: 'HEALTHY',
        value: ComponentHealthTypes.HEALTHY,
        classNames: 'text-success',
        title: 'Healthy'
      });
    });

    it('returns NA when healthType not found', function () {
      var healthItem = new HealthComponent({});
      expect(healthItem.getHealth().value).toEqual(ComponentHealthTypes.NA);
    });

  });

});
