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
    let value = file[prop];
    value = value.split("/");
    value = value[value.length - 1];

    if (file.nlink > 1) {
      element = (
        <a
          className="emphasize clickable"
          style={{color: "red"}}
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
    var className = ResourceTableUtil.getClassName;
    var heading = ResourceTableUtil.renderHeading(TaskDirectoryHeaderLabels);
    let propSortFunction = ResourceTableUtil.getPropSortFunction("path");
    let statSortFunction = ResourceTableUtil.getStatSortFunction(
      "path",
      function (file, resource) {
        return file[resource];
      }
    );

    return [
      {
        className,
        heading,
        headerClassName: className,
        prop: "path",
        render: this.renderHeadline.bind(this),
        sortable: true,
        sortFunction: propSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: "mode",
        render: null,
        sortable: true,
        sortFunction: propSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: "uid",
        render: this.renderState,
        sortable: true,
        sortFunction: propSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: "size",
        render: this.renderStats,
        sortable: true,
        sortFunction: statSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: "mtime",
        render: this.renderDate,
        sortable: true,
        sortFunction: statSortFunction
      }
    ];
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col />
        <col />
        <col />
        <col />
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
        keys={["path"]}
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

