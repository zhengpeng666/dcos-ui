jest.dontMock('../FormPanel');

var React = require('react');
var ReactDOM = require('react-dom');

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
      var definition = {
        nestedDefinition: {
          definition: [
            {
              name: 'nestedDefinition',
              definition: [nestedDefinition]
            }
          ]
        },
        anotherOne: {
          definition: [
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
          ]
        }
      };
      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <FormPanel definition={definition} />,
        this.container
      );

      this.flattenedDefinition = this.instance.flattenDefinition(definition);
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('flattens turns the 2nd level object to an item', function () {
      expect(this.flattenedDefinition.length).toEqual(5);
    });

    it('creates a object with a render function', function () {
      expect(typeof this.flattenedDefinition[0].render).toEqual('function');
    });
  });
});
