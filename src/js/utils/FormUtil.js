import _ from "underscore";

const FormUtil = {
  mergeSchemaOptions(schema, options) {
    return options.forEach(function (fieldOptions) {
      if (typeof fieldOptions === "string") {
        return schema[fieldOptions];
      }

      return _.extend({}, schema[fieldOptions.fieldName], fieldOptions);
    });
  }
};

module.exports = FormUtil;
