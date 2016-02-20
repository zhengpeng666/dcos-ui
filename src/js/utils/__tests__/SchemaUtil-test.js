jest.dontMock('../SchemaUtil');
jest.dontMock('../../components/__tests__/fixtures/MarathonConfigFixture');

var SchemaUtil = require('../SchemaUtil');

describe('SchemaUtil', function () {
  describe('#schemaToMultipleDefinition', function () {
    beforeEach(function () {
      var schema = {
        properties: {
          application: {
            description: 'This is a description',
            properties: {
              id: {
                type: 'string'
              }
            }
          }
        }
      };

      this.result = SchemaUtil.schemaToMultipleDefinition(schema);
    });

    it('sets the title of the definition', function () {
      expect(this.result.application.title).toEqual('application');
    });

    it('creates a field for the property', function () {
      expect(this.result.application).toNotEqual(undefined);
    });

    it('sets the title correctly', function () {
      expect(this.result.application.title).toEqual('application');
    });

    it('turns a schema to a definition', function () {
      expect(this.result.application.description)
        .toEqual('This is a description');
    });

    it('creates a definition for the field', function () {
      expect(Array.isArray(this.result.application.definition)).toEqual(true);
    });

    it('creates a nested definition correctly', function () {
      var schema = {
        properties: {
          application: {
            description: 'This is a description',
            properties: {
              id: {
                properties: {
                  name: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      };

      var result = SchemaUtil.schemaToMultipleDefinition(schema);
      expect(result.application.definition[0].definition).toNotEqual(undefined);
    });
  });
});
