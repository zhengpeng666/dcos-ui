import ErrorCodes from '../constants/ErrorCodes';
import Result from '../structs/Result';

var ValidatorUtil = {
  isDefined(value) {
    return Result.expectTrue((value != null && value !== '') || typeof value === 'number');
  },

  isEmail(email) {
    return Result.expectTrue(email != null &&
      email.length > 0 &&
      !/\s/.test(email) &&
      /.+@.+\..+/
      .test(email)
    );
  },

  isEmpty(data) {
    if (typeof data === 'number' || typeof data === 'boolean') {
      return new Result(ErrorCodes.UNKNOWN);
    }

    if (typeof data === 'undefined' || data === null) {
      return new Result(ErrorCodes.UNKNOWN);
    }

    if (typeof data.length !== 'undefined') {
      return Result.expectTrue(data.length === 0);
    }

    return Result.expectTrue(Object.keys(data).reduce(function (memo, key) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        memo++;
      }

      return memo;
    }, 0) === 0);
  },

  isInteger(value) {
    return Result.expectTrue(ValidatorUtil.isNumber(value) &&
      Number.isInteger(parseFloat(value)));
  },

  isNumber(value) {
    const number = parseFloat(value);

    return Result.expectTrue(/^[0-9e+-.,]+$/.test(value) && !Number.isNaN(number) &&
      Number.isFinite(number));
  },

  isNumberInRange(value, range = {}) {
    const {min = 0, max = Number.POSITIVE_INFINITY} = range;
    const number = parseFloat(value);

    return Result.expectTrue(ValidatorUtil.isNumber(value) && number >= min && number <= max);
  }
};

module.exports = ValidatorUtil;
