import _ from "underscore";
import classNames from "classnames";
import moment from "moment";
import React from "react";
import {Table} from "reactjs-components";

import DateUtil from "../utils/DateUtil";
import ResourceTableUtil from "../utils/ResourceTableUtil";
import TaskDirectoryHeaderLabels from "../constants/TaskDirectoryHeaderLabels";
import TaskDirectoryActions from "../events/TaskDirectoryActions";
import TaskDirectoryUtil from "../utils/TaskDirectoryUtil";
import Units from "../utils/Units";

export default class TaskDirectoryTable extends React.Component {
  handleTaskClick(path) {
    this.props.onFileClick(path);
  }

  renderHeadline(prop, file) {
    let label;
    let value = _.last(file[prop].split("/"));

    if (TaskDirectoryUtil.isDirectory(file)) {
      label = (
        <a
          className="emphasize clickable"
          onClick={this.handleTaskClick.bind(this, value)}>
          {value}
        </a>
      );
    } else {
      label = (
        <a
          className="emphasize"
          href={TaskDirectoryActions.getDownloadURL(this.props.nodeID, file.path)}>
          {value}
        </a>
      );
    }

    let iconClass = classNames({
      "icon icon-sprite icon-sprite-mini": true,
      "icon-file": !TaskDirectoryUtil.isDirectory(file),
      "icon-directory": TaskDirectoryUtil.isDirectory(file)
    });

    return (
      <div className="flex-box flex-box-align-vertical-center table-cell-flex-box">
        <div className="table-cell-status-icon table-cell-status-icon-mini">
          <i className={iconClass}></i>
        </div>
        <span title={value} className="table-cell-value text-overflow">
          {label}
        </span>
      </div>
    );
  }

  renderStats(prop, file) {
    return (
      <span>
        {Units.filesize(file[prop], 1)}
      </span>
    );
  }

  renderDate(prop, file) {
    return (
      <span title={DateUtil.msToDateStr(file[prop] * 1000)}>
        {moment.unix(file[prop]).fromNow()}
      </span>
    );
  }

  getClassName(prop, sortBy, row) {
    let isHeader = row == null;
    let propsToRight = ["uid", "size", "mtime"];

    return classNames({
      "text-align-right": _.contains(propsToRight, prop),
      "highlight": prop === sortBy.prop && isHeader,
      "clickable": isHeader
    });
  }

  getColumns() {
    let className = this.getClassName;
    let heading = ResourceTableUtil.renderHeading(TaskDirectoryHeaderLabels);
    let propSortFunction = ResourceTableUtil.getPropSortFunction("path");
    let statSortFunction = ResourceTableUtil.getStatSortFunction(
      "path",
      function (file, resource) {
        return file[resource];
      }
    );

    let defaultColumnSettings = {
      className,
      heading,
      headerClassName: className,
      render: null,
      sortable: true,
      sortFunction: propSortFunction
    };

    return [
      {
        prop: "path",
        render: this.renderHeadline.bind(this)
      },
      {
        prop: "mode"
      },
      {
        prop: "uid"
      },
      {
        prop: "size",
        render: this.renderStats,
        sortFunction: statSortFunction
      },
      {
        prop: "mtime",
        render: this.renderDate,
        sortFunction: statSortFunction
      }
    ].map(function (columnSetting) {
      return _.extend({}, defaultColumnSettings, columnSetting);
    });
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col style={{width: "150px"}}/>
        <col style={{width: "110px"}}/>
        <col style={{width: "100px"}}/>
        <col style={{width: "125px"}}/>
      </colgroup>
    );
  }

  render() {
    return (
      <Table
        className="table
          table-borderless-outer
          table-borderless-inner-columns
          flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        data={this.props.files}
        idAttribute="path"
        sortBy={{prop: "path", order: "desc"}}
        transition={false} />
    );
  }
}

TaskDirectoryTable.propTypes = {
  files: React.PropTypes.array
};

TaskDirectoryTable.defaultProps = {
  files: []
};

