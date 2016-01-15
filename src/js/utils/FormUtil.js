import _ from "underscore";

const FormUtil = {

  /**
  * Extracts the checked state of a single checkbox in a Form.
  *
  * @param  {Object} checkboxState with an array containing one checkbox's state
  * @return {Bool} of checkbox's checked state
  */
  getCheckboxInfo: function (checkboxState) {
    return _.reduce(checkboxState, function (initial, box) {
      return box[0] || initial;
    }, null);
  },

  /**
  * Extracts the name of a row in a Form with only one row.
  *
  * @param  {Object} checkboxState with an array containing one checkbox's state
  * @return {String} row name
  */
  getRowName: function (checkboxState) {
    return _.reduce(checkboxState, function (initial, box, name) {
      return name || initial;
    }, null);
  }
};

module.exports = FormUtil;
