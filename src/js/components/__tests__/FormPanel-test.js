jest.dontMock('../FormPanel');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var FormPanel = require('../FormPanel');

describe('FormPanel', function () {
  describe('#flattenDefinition', function () {
    beforeEach(function () {
      var nestedDefinition = {
        fieldType: 'text',
        name: 'Hostname',
        placeholder: 'Hostname',
        required: false,
        showError: false,
        showLabel: true,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      };
      var definition = [
        {
          name: 'nestedDefinition',
          definition: [nestedDefinition]
        },
        {
          fieldType: 'text',
          name: 'Hostname',
          placeholder: 'Hostname',
          required: false,
          showError: false,
          showLabel: true,
          writeType: 'input',
          validation: function () { return true; },
          value: ''
        }
      ];
      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <FormPanel />,
        this.container
      );

      this.flattenedDefinition = this.instance.flattenDefinition(definition);
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('flattens turns the 2nd level object to an item', function () {
      expect(this.flattenedDefinition.length).toEqual(3);
    });

    it('turns the nested definition into a React element', function () {
      expect(React.isValidElement(this.flattenedDefinition[0])).toEqual(true);
    });
  });
});
