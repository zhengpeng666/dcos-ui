const _ = require('underscore');
const classNames = require('classnames');
/*eslint-disable no-unused-vars*/
const React = require('react');
/*eslint-enable no-unused-vars*/

import Util from '../utils/Util';
import DateUtil from '../utils/DateUtil';
const HealthSorting = require('../constants/HealthSorting');
const MarathonStore = require('../stores/MarathonStore');
import TableUtil from '../utils/TableUtil';

function leftAlignCaret(prop) {
  return _.contains(['cpus', 'mem', 'disk', 'size', 'mtime'], prop);
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

  getSortFunction: function (tieBreakerProp) {
    return TableUtil.getSortFunction(tieBreakerProp, function (item, prop) {
      if (prop === 'updated') {
        return getUpdatedTimestamp(item) || 0;
      }

      if (prop === 'health') {
        return HealthSorting[MarathonStore.getServiceHealth(item.name).key];
      }

      if (prop === 'cpus' || prop === 'mem' || prop === 'disk') {
        if (item.getUsageStats) {
          return item.getUsageStats(prop).value;
        }

        if (Util.findNestedPropertyInObject(item, `resources.${prop}`)) {
          return item.resources[prop];
        }

        let value = item.get ? item.get(prop) : item[prop];

        if (_.isArray(value)) {
          console.log(value);
          return _.last(value).value;
        }

        return value;
      }

      return item.get ? item.get(prop) : item[prop];
    });
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
