const _ = require("underscore");
const classNames = require("classnames");
/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

import DateUtil from "../utils/DateUtil";
const HealthSorting = require("../constants/HealthSorting");
const MarathonStore = require("../stores/MarathonStore");

function isStat(prop) {
  return _.contains(["cpus", "mem", "disk"], prop);
}

function checkIfTied(a, b, tieBreakerProp, aValue, bValue) {
  if (aValue === bValue) {
    if (a[tieBreakerProp] > b[tieBreakerProp]) {
      return 1;
    } else if (a[tieBreakerProp] < a[tieBreakerProp]) {
      return -1;
    } else {
      return 0;
    }
  }

  return false;
}

function getUpdatedTimestamp(model) {
  let lastStatus = _.last(model.statuses);
  return lastStatus && lastStatus.timestamp || null;
}

function getStatSortFunction(title, prop) {
  return function (a, b) {
    let resourceProp = "used_resources";
    if (!a[resourceProp]) {
      resourceProp = "resources";
    }

    let aValue = a[resourceProp][prop];
    let bValue = b[resourceProp][prop];

    if (_.isArray(aValue)) {
      aValue = _.last(aValue).value;
      bValue = _.last(bValue).value;
    }

    let tied = checkIfTied(a, b, title, aValue, bValue);

    if (typeof tied === "number") {
      return tied;
    }

    return aValue - bValue;
  };
}

function getPropSortFunction(title, prop) {
  return function (a, b) {
    let aValue = a[prop];
    let bValue = b[prop];

    if (prop === "updated") {
      aValue = getUpdatedTimestamp(a) || 0;
      bValue = getUpdatedTimestamp(b) || 0;
    }

    if (prop === "health") {
      let aHealth = MarathonStore.getServiceHealth(a.name);
      let bHealth = MarathonStore.getServiceHealth(b.name);
      aValue = HealthSorting[aHealth.key];
      bValue = HealthSorting[bHealth.key];
    }

    if (_.isNumber(aValue)) {
      let tied = checkIfTied(a, b, title, aValue, bValue);

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
        return getStatSortFunction(title, prop);
      }

      return getPropSortFunction(title, prop);
    };
  },

  renderHeading: function (config) {
    return function (prop, order, sortBy) {
      var title = config[prop];
      var caret = {
        before: null,
        after: null
      };
      var caretClassSet = classNames({
        "caret": true,
        "caret--visible": prop === sortBy.prop,
        "caret--desc": order === "desc",
        "caret--asc": order === "asc"
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

  renderUpdated: function (prop, model) {
    let updatedAt = getUpdatedTimestamp(model);

    if (updatedAt == null) {
      updatedAt = "NA";
    } else {
      updatedAt = DateUtil.msToDateStr(updatedAt.toFixed(3) * 1000);
    }

    return (
      <span>
        {updatedAt}
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

module.exports = ResourceTableUtil;
