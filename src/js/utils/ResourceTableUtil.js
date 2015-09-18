const _ = require("underscore");
const classNames = require("classnames");
/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

const HealthSorting = require("../constants/HealthSorting");
const MarathonStore = require("../stores/MarathonStore");

function isStat(prop) {
  return _.contains(["cpus", "mem", "disk"], prop);
}

function tieBreaker(a, b, tiedProp, aValue, bValue) {
  if (aValue === bValue) {
    if (a[tiedProp] > b[tiedProp]) {
      return 1;
    } else if (a[tiedProp] < a[tiedProp]) {
      return -1;
    } else {
      return 0;
    }
  }

  return false;
}

var ResourceTableUtil = {
  getClassName: function (prop, sortBy, row) {
    return classNames({
      "align-right": isStat(prop) || prop === "TASK_RUNNING",
      "hidden-mini": isStat(prop),
      "highlight": prop === sortBy.prop,
      "clickable": row == null // this is a header
    });
  },

  getSortFunction: function (title) {
    return function (prop) {
      if (isStat(prop)) {
        return function (a, b) {
          if (_.isArray(a.used_resources[prop])) {
            let aValue = _.last(a.used_resources[prop]).value;
            let bValue = _.last(b.used_resources[prop]).value;
            let tied = tieBreaker(a, b, title, aValue, bValue);

            if (typeof tied === "number") {
              return tied;
            }

            return aValue - bValue;
          } else {
            let tied = tieBreaker(
              a, b, title, a.used_resources[prop], b.used_resources[prop]
            );

            if (typeof tied === "number") {
              return tied;
            }

            return a.used_resources[prop] - b.used_resources[prop];
          }
        };
      }

      return function (a, b) {
        let aValue = a[prop];
        let bValue = b[prop];

        if (prop === "health") {
          let aHealth = MarathonStore.getServiceHealth(a.name);
          let bHealth = MarathonStore.getServiceHealth(b.name);
          aValue = HealthSorting[aHealth.key];
          bValue = HealthSorting[bHealth.key];
        }

        if (_.isNumber(aValue)) {
          let tied = tieBreaker(a, b, title, aValue, bValue);

          if (typeof tied === "number") {
            return tied;
          }
          return aValue - bValue;
        }

        aValue = aValue.toString().toLowerCase() + "-" + a[title].toLowerCase();
        bValue = bValue.toString().toLowerCase() + "-" + b[title].toLowerCase();

        if (aValue > bValue) {
          return 1;
        } else if (aValue < bValue) {
          return -1;
        } else {
          return 0;
        }
      };
    };
  },

  renderHeader: function (config) {
    return function (prop, order, sortBy) {
      var title = config[prop];
      var caret = {
        before: null,
        after: null
      };
      var caretClassSet = classNames({
        "caret": true,
        "dropup": order === "desc",
        "invisible": prop !== sortBy.prop
      });

      if (isStat(prop) || prop === "TASK_RUNNING") {
        caret.before = <span className={caretClassSet} />;
      } else {
        caret.after = <span className={caretClassSet} />;
      }

      return (
        <span>
          {caret.before}
          {title}
          {caret.after}
        </span>
      );
    };
  },

  renderTask: function (prop, model) {
    return (
      <span>
        {model[prop]}
        <span className="visible-mini-inline"> Tasks</span>
      </span>
    );
  },

  tieBreaker: tieBreaker
};

module.exports = ResourceTableUtil;
