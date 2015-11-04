import _ from "underscore";
import React from "react";
import {Table} from "reactjs-components";

import DateUtil from "../utils/DateUtil";
import ResourceTableUtil from "../utils/ResourceTableUtil";
import TaskDirectoryHeaderLabels from "../constants/TaskDirectoryHeaderLabels";
import TaskDirectoryURLUtil from "../utils/TaskDirectoryURLUtil";
import Units from "../utils/Units";

export default class TaskDirectoryTable extends React.Component {
  handleTaskClick(path) {
    this.props.onFileClick(path);
  }

  renderHeadline(prop, file) {
    let element;
    let value = _.last(file[prop].split("/"));

    // File is a directory if nlink is greater than 1.
    if (file.nlink > 1) {
      element = (
        <a
          className="emphasize clickable"
          onClick={this.handleTaskClick.bind(this, value)}>
          {value}
        </a>
      );
    } else {
      element = (
        <a
          className="emphasize"
          href={TaskDirectoryURLUtil.getDownloadURL(this.props.nodeID, file.path)}>
          {value}
        </a>
      );
    }

    return (
      <div className="flex-box flex-box-align-vertical-center">
        <div className="flex-box flex-box-col">
          {element}
        </div>
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
      <span>
        {DateUtil.msToDateStr(file[prop] * 1000)}
      </span>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
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
        <col style={{width: "100px"}}/>
        <col style={{width: "100px"}}/>
        <col style={{width: "100px"}}/>
        <col style={{width: "100px"}}/>
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

