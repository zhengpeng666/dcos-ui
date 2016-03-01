function schemaToFieldDefinition(fieldName, fieldProps, formParent) {
  let value = '';

  if (fieldProps.default != null) {
    value = fieldProps.default;
    if (typeof value === 'number') {
      value = value.toString();
    }
  }

  let definition = {
    fieldType: 'text',
    formParent,
    name: fieldName,
    placeholder: '',
    required: false,
    showError: false,
    showLabel: true,
    writeType: 'input',
    validation: function () { return true; },
    value: value,
    valueType: fieldProps.type
  };

  if (typeof value === 'boolean') {
    definition.checked = value;
  }

  if (Array.isArray(fieldProps.default) && fieldProps.default.length === 0) {
    definition.value = '';
  }

  if (fieldProps.type === 'boolean') {
    definition.fieldType = 'checkbox';
    definition.checked = fieldProps.default || false;
  }

  return definition;
}

function nestedSchemaToFieldDefinition(fieldName, fieldProps, topLevelProp, subheaderRender) {
  let nestedDefinition = {
    name: fieldName,
    formParent: topLevelProp,
    render: subheaderRender.bind(null, fieldName),
    fieldType: 'object',
    definition: []
  };

  let properties = fieldProps.properties;
  Object.keys(properties).forEach(function (nestedFieldName) {
    nestedDefinition.definition.push(
      schemaToFieldDefinition(
        nestedFieldName,
        properties[nestedFieldName],
        nestedFieldName
      )
    );
  });

  return nestedDefinition;
}

let SchemaUtil = {
  schemaToMultipleDefinition: function (schema, subheaderRender) {
    let multipleDefinition = {};
    let schemaProperties = schema.properties;

    Object.keys(schemaProperties).forEach(function (topLevelProp) {
      let topLevelPropertyObject = schemaProperties[topLevelProp];
      let secondLevelProperties = topLevelPropertyObject.properties;
      let definitionForm = multipleDefinition[topLevelProp] = {};

      definitionForm.title = topLevelProp;
      definitionForm.description = topLevelPropertyObject.description;
      definitionForm.definition = [];
      Object.keys(secondLevelProperties).forEach(function (secondLevelProp) {
        let secondLevelObject = secondLevelProperties[secondLevelProp];
        let fieldDefinition;

        if (secondLevelObject.properties == null) {
          fieldDefinition = schemaToFieldDefinition(
            secondLevelProp,
            secondLevelObject,
            topLevelProp
          );
        } else {
          fieldDefinition = nestedSchemaToFieldDefinition(
            secondLevelProp,
            secondLevelObject,
            topLevelProp,
            subheaderRender
          );
        }
        definitionForm.definition.push(fieldDefinition);
      });

    });

    return multipleDefinition;
  },

  definitionToJSONDocument: function (definition) {
    let jsonDocument = {};

    Object.keys(definition).forEach(function (topLevelProp) {
      let topLevelProperties = definition[topLevelProp];
      let topLevelDefinition = jsonDocument[topLevelProp] = {};
      let topLevelDefinitionValues = topLevelProperties.definition;

      if (!topLevelDefinitionValues) {
        return;
      }

      topLevelDefinitionValues.forEach(function (formDefinition) {
        if (formDefinition.definition) {
          let nested = topLevelDefinition[formDefinition.name] = {};
          formDefinition.definition.forEach(function (nestedDefinition) {
            let fieldName = nestedDefinition.name;
            let fieldValue = nestedDefinition.value;
            nested[fieldName] = fieldValue;
          });
        } else {
          let fieldName = formDefinition.name;
          let fieldValue = formDefinition.value;
          topLevelDefinition[fieldName] = fieldValue;
        }
      });
    });

    return jsonDocument;
  }
};

module.exports = SchemaUtil;
