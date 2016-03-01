import _ from 'underscore';
import tv4 from 'tv4';

const DEFAULT_FORM_VALUES = {
  array: [],
  boolean: false,
  integer: null,
  number: null,
  string: ''
};

function filteredPaths(combinedPath) {
  return combinedPath.split('/').filter(function (path) {
    return path.length > 0;
  });
}

let SchemaFormUtil = {
  getDefinitionFromPath(definition, paths) {
    if (definition[paths[0]]) {
      definition = definition[paths[0]];
      paths = paths.slice(1);
    }

    paths.forEach(function (path) {
      if (definition.definition == null) {
        return;
      }

      let nextDefinition = _.find(definition.definition, function (definitionField) {
        return definitionField.name === path || definitionField.title === path;
      });

      if (nextDefinition) {
        definition = nextDefinition;
      }
    });

    return definition;
  },

  processFormModel(model, multipleDefinition, prevPath = []) {
    let copy = {};

    Object.keys(model).forEach(function (key) {
      let value = model[key];
      let path = prevPath.concat([key]);

      if (typeof value === 'object' && value !== null) {
        if (value.hasOwnProperty('checked')) {
          value = value.checked;
        } else {
          copy[key] = SchemaFormUtil.processFormModel(
            value, multipleDefinition, path
          );
        }
        return;
      }

      let definition = SchemaFormUtil.getDefinitionFromPath(
        multipleDefinition, path
      );
      if (definition == null) {
        return;
      }

      let valueType = definition.valueType;

      if (valueType === 'integer' || valueType === 'number') {
        value = Number(value);
        if (isNaN(value)) {
          value = null;
        }
      }

      if (value === null) {
        value = DEFAULT_FORM_VALUES[valueType];
      }

      if (valueType === 'array' && typeof value === 'string') {
        value = value.split(',').map((val) => { return val.trim(); });
      }

      copy[key] = value;
    });

    return copy;
  },

  parseTV4Error(tv4Error) {
    let errorObj = {
      message: tv4Error.message,
      path: filteredPaths(tv4Error.dataPath)
    };

    let schemaPath = tv4Error.schemaPath.split('/');

    if (tv4Error.code === 302) {
      errorObj.path.push(tv4Error.params.key);
    }

    if (schemaPath[schemaPath.length - 2] === 'items') {
      errorObj.path.pop();
    }

    return errorObj;
  },

  tv4Validate(model, schema) {
    return tv4.validateMultiple(model, schema);
  }
};

module.exports = SchemaFormUtil;
