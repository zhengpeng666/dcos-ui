jest.dontMock('../FormUtil');

var FormUtil = require('../FormUtil');

describe('FormUtil', function () {

  beforeEach(function () {
    this.formState = {
      'formName': [
        {
          checked: true,
          indeterminate: false,
          labelClass: 'labelClass',
          name: 'name'
        }
      ]
    };
  });

  describe('getCheckboxInfo', function () {

    it('returns the field state of a Form with only one field', function () {
      expect(FormUtil.getCheckboxInfo(this.formState)).toEqual({
        checked: true,
        indeterminate: false,
        labelClass: 'labelClass',
        name: 'name'
      });
    });

  });

  describe('getRowName', function () {

    it('returns the row name of a Form with only one field', function () {
      expect(FormUtil.getRowName(this.formState)).toEqual('formName');
    });

  });

});
