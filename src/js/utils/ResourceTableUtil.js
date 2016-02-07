const _ = require('underscore');
const classNames = require('classnames');
/*eslint-disable no-unused-vars*/
const React = require('react');
/*eslint-enable no-unused-vars*/

import DateUtil from '../utils/DateUtil';
const HealthSorting = require('../constants/HealthSorting');
const MarathonStore = require('../stores/MarathonStore');

function leftAlignCaret(prop) {
  return _.contains(['cpus', 'mem', 'disk', 'size', 'mtime'], prop);
}

function compareValues(a, b) {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
}

function compareFunction(a, b, tieBreakerProp, aValue, bValue) {
  if (aValue === bValue) {
    return compareValues(a[tieBreakerProp], b[tieBreakerProp]);
  }

  return aValue - bValue;
}

function getUpdatedTimestamp(model) {
  let lastStatus = _.last(model.statuses);
  return lastStatus && lastStatus.timestamp || null;
}

var ResourceTableUtil = {
  getClassName: function (prop, sortBy, row) {
    return classNames({
      'text-align-right': leftAlignCaret(prop) || prop === 'TASK_RUNNING',
      'hidden-mini': leftAlignCaret(prop),
      'highlight': prop === sortBy.prop,
      'clickable': row == null // this is a header
    });
  },

  getStatSortFunction: function (baseProp, getResource) {
    return function (prop) {
      return function (a, b) {
        let aValue = getResource(a, prop);
        let bValue = getResource(b, prop);

        if (_.isArray(aValue)) {
          aValue = _.last(aValue).value;
          bValue = _.last(bValue).value;
        }

        return compareFunction(a, b, baseProp, aValue, bValue);
      };
    };
  },

  getPropSortFunction: function (baseProp) {
    return function (prop) {
      return function (a, b) {
        let aValue = a[prop];
        let bValue = b[prop];

        if (prop === 'updated') {
          aValue = getUpdatedTimestamp(a) || 0;
          bValue = getUpdatedTimestamp(b) || 0;
        }

        if (prop === 'health') {
          let aHealth = MarathonStore.getServiceHealth(a.name);
          let bHealth = MarathonStore.getServiceHealth(b.name);
          aValue = HealthSorting[aHealth.key];
          bValue = HealthSorting[bHealth.key];
        }

        if (_.isNumber(aValue)) {
          return compareFunction(a, b, baseProp, aValue, bValue);
        }

        aValue = aValue.toString().toLowerCase() + '-' +
          a[baseProp].toLowerCase();
        bValue = bValue.toString().toLowerCase() + '-' +
          b[baseProp].toLowerCase();

        return compareValues(aValue, bValue);
      };
    };
  },

  renderHeading: function (config) {
    return function (prop, order, sortBy) {
      let title = config[prop];
      let caret = {
        before: null,
        after: null
      };
      let caretClassSet = classNames(
        `caret caret--${order}`,
        {'caret--visible': prop === sortBy.prop}
      );

      if (leftAlignCaret(prop) || prop === 'TASK_RUNNING') {
        caret.before = <span className={caretClassSet} />;
      } else {
        caret.after = <span className={caretClassSet} />;
      }

      return (
        <span>
          {caret.before}
          <span className="table-header-title">{title}</span>
          {caret.after}
        </span>
      );
    };
  },

  renderUpdated: function (prop, model) {
    let updatedAt = getUpdatedTimestamp(model);

    if (updatedAt == null) {
      return 'N/A';
    }

    let exactTime = DateUtil.msToDateStr(updatedAt.toFixed(3) * 1000);
    let relativeTime = DateUtil.msToRelativeTime(updatedAt);

    return <span title={exactTime}>{relativeTime}</span>;
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
