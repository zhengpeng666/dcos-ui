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

function setDefinitionValue(thingToSet, definition) {
  let {path, value} = thingToSet;
  let definitionToSet = SchemaFormUtil.getDefinitionFromPath(definition, path);

  definitionToSet.value = value;
  definitionToSet.startValue = value;
}

function getThingsToSet(model, path) {
  path = path || [];
  let thingsToSet = [];

  Object.keys(model).forEach(function (key) {
    let pathCopy = path.concat([key]);
    let value = model[key];

    if (typeof value === 'object' && value !== null) {
      thingsToSet = thingsToSet.concat(getThingsToSet(value, pathCopy));
    } else if (value != null) {
      thingsToSet.push({
        path: pathCopy,
        value
      });
    }
  });

  return thingsToSet;
}

function processValue(value, valueType, isRequired) {
  if (valueType === 'integer' || valueType === 'number') {
    if (value !== null && value !== '') {
      value = Number(value);
      if (isNaN(value)) {
        value = null;
      }
    } else {
      value = null;
    }
  }

  if (typeof value === 'string' && isRequired && value === '') {
    value = null;
  } else {
    if (value === null) {
      value = DEFAULT_FORM_VALUES[valueType];
    }
  }

  if (valueType === 'array' && typeof value === 'string') {
    value = value.split(',')
      .map(function (val) { return val.trim(); })
      .filter(function (val) { return val !== ''; });
  }

  return value;
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

      let nextDefinition = _.find(
        definition.definition,
        function (definitionField) {
          return definitionField.name === path
            || definitionField.title === path;
        }
      );

      if (nextDefinition) {
        definition = nextDefinition;
      }
    });

    return definition;
  },

  processFormModel(model, multipleDefinition, prevPath = []) {
    let newModel = {};

    Object.keys(model).forEach(function (key) {
      let value = model[key];
      let path = prevPath.concat([key]);

      // Nested model.
      if (typeof value === 'object' && value !== null) {
        newModel[key] = SchemaFormUtil.processFormModel(
          value, multipleDefinition, path
        );
        return;
      }

      let definition = SchemaFormUtil.getDefinitionFromPath(
        multipleDefinition, path
      );
      if (definition == null) {
        return;
      }

      let {isRequired, valueType} = definition;
      newModel[key] = processValue(value, valueType, isRequired);
    });

    return newModel;
  },

  mergeModelIntoDefinition(model, definition) {
    let thingsToSet = getThingsToSet(model);

    thingsToSet.forEach(function (thingToSet) {
      setDefinitionValue(thingToSet, definition);
    });
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

  validateModelWithSchema(model, schema) {
    let result = tv4.validateMultiple(model, schema);
    if (result.valid) {
      return [];
    }

    return result.errors.map(function (error) {
      return SchemaFormUtil.parseTV4Error(error);
    });
  }
};

module.exports = SchemaFormUtil;
