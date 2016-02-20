function schemaToFieldDefinition(fieldName, fieldProps) {
  var value = '';

  if (fieldProps.default != null) {
    value = fieldProps.default;
    if (typeof value === 'number') {
      value = value.toString();
    }
  }

  var definition = {
    fieldType: 'text',
    name: fieldName,
    placeholder: '',
    required: false,
    showError: false,
    showLabel: true,
    writeType: 'input',
    validation: function () { return true; },
    value: value
  };

  if (Array.isArray(fieldProps.default) && fieldProps.default.length === 0) {
    definition.value = '';
  }

  if (fieldProps.type === 'boolean') {
    definition.fieldType = 'checkbox';
    definition.checked = fieldProps.default || false;
  }

  return definition;
}

function nestedSchemaToFieldDefinition(fieldName, fieldProps) {
  let nestedDefinition = {
    name: fieldName,
    definition: []
  };

  let properties = fieldProps.properties;
  Object.keys(properties).forEach(function (nestedFieldName) {
    nestedDefinition.definition.push(
      nestedFieldName,
      properties[nestedFieldName]
    );
  });

  return nestedDefinition;
}

let SchemaUtil = {
  schemaToMultipleDefinition: function (schema) {
    var multipleDefinition = {};
    var schemaProperties = schema.properties;

    Object.keys(schemaProperties).forEach(function (topLevelProp) {
      var topLevelPropertyObject = schemaProperties[topLevelProp];
      var secondLevelProperties = topLevelPropertyObject.properties;
      var definitionForm = multipleDefinition[topLevelProp] = {};

      definitionForm.title = topLevelProp;
      definitionForm.description = topLevelPropertyObject.description;
      definitionForm.definition = [];
      Object.keys(secondLevelProperties).forEach(function (secondLevelProp) {
        let secondLevelObject = secondLevelProperties[secondLevelProp];
        let fieldDefinition;

        if (secondLevelObject.properties == null) {
          fieldDefinition = schemaToFieldDefinition(
            secondLevelProp,
            secondLevelObject
          );
        } else {
          fieldDefinition = nestedSchemaToFieldDefinition(
            secondLevelProp,
            secondLevelObject
          );
        }
        definitionForm.definition.push(fieldDefinition);
      });

    });

    return multipleDefinition;
  },

  definitionToJSONDocument: function (definition) {
    var jsonDocument = {};

    Object.keys(definition).forEach(function (topLevelProp) {
      var topLevelProperties = definition[topLevelProp];
      var topLevelDefinition = jsonDocument[topLevelProp] = {};
      var topLevelDefinitionValues = topLevelProperties.definition;

      if (!topLevelDefinitionValues) {
        return;
      }

      topLevelDefinitionValues.forEach(function (formDefinition) {
        if (formDefinition.definition) {
          var nested = topLevelDefinition[formDefinition.name] = {};
          formDefinition.definition.forEach(function (nestedDefinition) {
            var fieldName = nestedDefinition.name;
            var fieldValue = nestedDefinition.value;
            nested[fieldName] = fieldValue;
          });
        } else {
          var fieldName = formDefinition.name;
          var fieldValue = formDefinition.value;
          topLevelDefinition[fieldName] = fieldValue;
        }
      });
    });

    return jsonDocument;
  }
};

module.exports = SchemaUtil;
