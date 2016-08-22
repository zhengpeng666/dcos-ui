import ErrorCodes from '../constants/ErrorCodes';

/**
 * General purpose result, evaluated to a boolean value when used
 * in a statement. If the error code is not the number `0` an error
 * is assumed to have occured.
 *
 * You can optionally specify an error message, in order to display
 * something more useful to the user.
 */
class Result extends Boolean {

  /**
   * Shorthand function to create a result object from a boolean value, having
   * a `code = 0` if the boolean value is true and `code = UNKNOWN` if false.
   *
   * You can optionally specify a message to be set to the result object if the
   * boolean value is `false`.
   *
   * @param {Boolean} bool - The boolean value to test
   * @param {String} message - An optional message to be defined if the boolean value is false
   * @param {Number} code - An optional code to be used instead of UNKNOWN when the error occurs
   * @returns {Result} - Returns a result instance
   */
  static expectTrue(bool, message = null, code = ErrorCodes.UNKNOWN) {
    if (bool) {
      return new Result(0);
    } else {
      return new Result(code, message);
    }
  }

  /**
   * Shorthand function to create a result object from a boolean value, having
   * a `code = 0` if the boolean value is false and `code = UNKNOWN` if true.
   *
   * You can optionally specify a message to be set to the result object if the
   * boolean value is `true`.
   *
   * @param {Boolean} bool - The boolean value to test
   * @param {String} message - An optional message to be defined if the boolean value is true
   * @param {Number} code - An optional code to be used instead of UNKNOWN when the error occurs
   * @returns {Result} - Returns a result instance
   */
  static expectFalse(bool, message = null, code = ErrorCodes.UNKNOWN) {
    if (bool) {
      return new Result(code, message);
    } else {
      return new Result(0);
    }
  }

  /**
   * Result constructor
   *
   * @param {Number} code - The error code. Must be `0` to assume success
   * @param {String} message - An optional error message
   */
  constructor(code = 0, message = null) {
    super(code === 0);
    this.code = code;
    this.message = message;
  }

}

module.exports = Result;
