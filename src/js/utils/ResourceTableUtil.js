const _ = require("underscore");
const classNames = require("classnames");
/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

const HealthSorting = require("../constants/HealthSorting");
const MarathonStore = require("../stores/MarathonStore");
const TableHeaderLabels = require("../constants/TableHeaderLabels");

function isStat(prop) {
  return _.contains(["cpus", "mem", "disk"], prop);
}

var TableUtil = {
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
        return function (model) {
          return _.last(model.used_resources[prop]).value;
        };
      }

      return function (model) {
        let value = model[prop];

        if (prop === "health") {
          let health = MarathonStore.getHealthByName(model.name);
          value = HealthSorting[health.key];
        }

        if (_.isNumber(value)) {
          return value;
        }

        return value.toString().toLowerCase() + "-" + model[title].toLowerCase();
      };
    };
  },

  renderHeader: function (prop, order, sortBy) {
    var title = TableHeaderLabels[prop];
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
  },

  renderTask: function (prop, model) {
    return (
      <span>
        {model[prop]}
        <span className="visible-mini-inline"> Tasks</span>
      </span>
    );
  }
};

module.exports = TableUtil;
