var _ = require("underscore");
var classNames = require("classnames");
var React = require("react/addons");

var DateUtil = require("../utils/DateUtil");
var TaskHealthStates = require("../constants/TaskHealthStates");
var Maths = require("../utils/Maths");
var ResourceTableUtil = require("../utils/ResourceTableUtil");
var Table = require("./Table");
var TaskTableHeaderLabels = require("../constants/TaskTableHeaderLabels");
var Units = require("../utils/Units");

var ServiceTasksTable = React.createClass({

  displayName: "ServiceTasksTable",

  propTypes: {
    tasks: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      tasks: []
    };
  },

  renderHeadline: function (prop, model) {
    var dangerState = _.contains([
      "TASK_FAILED", "TASK_KILLED", "TASK_LOST", "TASK_ERROR"
    ], model.state);

    var successState = _.contains([
      "TASK_RUNNING", "TASK_STARTING", "TASK_FINISHED"
    ], model.state);

    var statusClass = classNames({
      "dot": true,
      success: successState,
      danger: dangerState
    });

    var title = model.name;
    if (!title) {
      title = model.id;
    }

    return (
      <div className="flex-box flex-box-align-vertical-center">
        <div>
          <span className={statusClass}></span>
        </div>
        <div className="flex-box flex-box-col">
          <div className="emphasize">
            {title}
          </div>
        </div>
      </div>
    );
  },

  renderStats: function (prop, model) {
    var value = Maths.round(model.resources[prop], 2);

    if (prop !== "cpus") {
      value = Units.filesize(value / 1024, 1, null, null, ["GiB"]);
    }

    return (
      <span>
        {value}
      </span>
    );
  },

  renderUpdated: function (prop, model) {
    var updatedAt = _.last(model.statuses).timestamp;
    updatedAt = DateUtil.msToDateStr(updatedAt.toFixed(3) * 1000);
    return (
      <span>
        {updatedAt}
      </span>
    );
  },

  getSortFunction: function (title) {
    return function (prop) {
      return function (model) {
        var value = model[prop];

        if (prop === "cpus" || prop === "mem") {
          return model.resources[prop];
        }

        if (prop === "updated") {
          return value;
        }

        return value.toString().toLowerCase() + "-" + model[title].toLowerCase();
      };
    };
  },

  getColumns: function () {
    return [
      {
        className: ResourceTableUtil.getClassName,
        header: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "name",
        render: this.renderHeadline,
        sortable: true
      },
      {
        className: ResourceTableUtil.getClassName,
        header: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "updated",
        render: this.renderUpdated,
        sortable: true
      },
      {
        className: ResourceTableUtil.getClassName,
        header: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "state",
        render: this.renderState,
        sortable: true
      },
      {
        className: ResourceTableUtil.getClassName,
        header: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "cpus",
        render: this.renderStats,
        sortable: true
      },
      {
        className: ResourceTableUtil.getClassName,
        header: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "mem",
        render: this.renderStats,
        sortable: true
      }
    ];
  },

  getColGroup: function () {
    return (
      <colgroup>
        <col />
        <col />
        <col style={{width: "100px"}} />
        <col style={{width: "100px"}} />
        <col style={{width: "100px"}} />
      </colgroup>
    );
  },

  renderStat: function (prop, model) {
    var value = Maths.round(model.resources[prop], 2);

    if (prop !== "cpus") {
      value = Units.filesize(value / 1024, 1, null, null, ["GiB"]);
    }

    return (
      <span>
        {value}
      </span>
    );
  },

  renderState: function (prop, model) {
    return TaskHealthStates[model[prop]];
  },

  render: function () {
    return (
      <Table
        className="table table-borderless-outer table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        data={this.props.tasks.slice(0)}
        keys={["id"]}
        sortBy={{prop: "name", order: "desc"}}
        sortFunc={this.getSortFunction("name")} />
    );
  }
});

module.exports = ServiceTasksTable;
