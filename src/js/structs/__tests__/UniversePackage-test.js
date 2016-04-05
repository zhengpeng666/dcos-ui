jest.dontMock('../../constants/ServiceImages');

var ServiceImages = require('../../constants/ServiceImages');
var UniversePackage = require('../UniversePackage');

describe('UniversePackage', function () {

  describe('#getIcons', function () {

    it('returns a hash of icons', function () {
      var pkg = new UniversePackage({
        'resource': {
          'images': {
            'icon-small': 'small.png',
            'icon-medium': 'medium.png',
            'icon-large': 'large.png'
          }
        }
      });
      expect(pkg.getIcons()).toEqual({
        'icon-small': 'small.png',
        'icon-medium': 'medium.png',
        'icon-large': 'large.png'
      });
    });

    it('returns a default icons when "resources" are is empty', function () {
      var pkg = new UniversePackage({'resources': {}});
      expect(pkg.getIcons()).toEqual(ServiceImages.NA_IMAGES);
    });

    it('returns a default icons with an empty object', function () {
      var pkg = new UniversePackage({});
      expect(pkg.getIcons()).toEqual(ServiceImages.NA_IMAGES);
    });

    it('returns a default icons with no parameters', function () {
      var pkg = new UniversePackage();
      expect(pkg.getIcons()).toEqual(ServiceImages.NA_IMAGES);
    });

  });

  describe('#getSelectedAndNonSelectedPackages', function () {
    beforeEach(function () {
      this.packages = [
        {name: 'isSelected', selected: true},
        {name: 'isNotSelected', selected: false},
        {name: 'isNotSelected2', selected: false}
      ];
      this.packagesList = new UniversePackage({items: this.packages});
    });

    it('returns the correct number of selected packages', function () {
      var result = this.packagesList.getSelectedAndNonSelectedPackages();
      expect(result.selectedPackages.getItems().length).toEqual(1);
    });

    it('returns the correct number of non-selected packages', function () {
      var result = this.packagesList.getSelectedAndNonSelectedPackages();
      expect(result.nonSelectedPackages.getItems().length).toEqual(2);
    });
  });

});
