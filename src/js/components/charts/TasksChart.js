/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var DialChart = require("./DialChart");

var tasksPerRow = 3;
var taskInfo = {
  "TASK_RUNNING": {label: "Tasks running", colorIndex: 4},
  "TASK_STAGING": {label: "Tasks staging", colorIndex: 1}
};

function getEmptyTaskData() {
  return _.map(taskInfo, function(val, key) {
    return {name: key, colorIndex: val.colorIndex, value: 0};
  });
}

var TasksChart = React.createClass({

  displayName: "TasksChart",

  propTypes: {
    // [{state: "TASK_RUNNING", tasks: [{id: "askdfja", name: "datanode"}]}]
    tasks: React.PropTypes.array.isRequired
  },

  shouldComponentUpdate: function (nextProps) {
    var previousTasks = this.getTasks(this.props.tasks);
    var newTasks = this.getTasks(nextProps.tasks);

    // If equal, do not update
    return !_.isEqual(previousTasks, newTasks);
  },

  getTaskInfo: function (tasks) {
    if (tasks.length === 0) {
      tasks = getEmptyTaskData();
    }

    var numberOfTasks = _.size(taskInfo);

    return _.map(taskInfo, function (info, key) {
      var task = _.findWhere(tasks, {name: key});
      if (task === undefined) {
        task = { value: 0 };
      }
      var classes = {
        "text-align-center": true
      };
      // equalize columns for units
      if (numberOfTasks > tasksPerRow) {
        classes["column-small-4"] = true;
      } else {
        classes["column-small-" + 12 / numberOfTasks] = true;
      }
      var classSet = React.addons.classSet(classes);
      return (
        <div key={key} className={classSet}>
          <p className="h1 unit">
            {task.value}
          </p>
          <p className={"unit-label path-color-" + info.colorIndex}>
            {info.label}
          </p>
        </div>
      );
    });
  },

  getTotal: function (tasks) {
    return _.reduce(tasks, function(acc, task) {
      return acc + task.value;
    }, 0);
  },

  getTasks: function (tasks) {
    var keys = _.keys(taskInfo);
    var starting = 0;
    return _.chain(tasks)
      .filter(function (task) {
        // save starting tasks for use later
        if (task.state === "TASK_STARTING") {
          starting = task.tasks.length;
        }
        return _.contains(keys, task.state);
      })
      .sortBy("state")
      .map(function (task) {
        var value = task.tasks.length;
        var info = taskInfo[task.state];
        // add starting to staging
        if (task.state === "TASK_STAGING") {
          value = starting + task.tasks.length;
        }
        return {colorIndex: info.colorIndex, name: task.state, value: value};
      }
    ).value();
  },

  getDialChart: function (tasks) {
    var total = this.getTotal(tasks);

    if (tasks.length === 0) {
      tasks = getEmptyTaskData();
    }

    return (
      <DialChart
        data={tasks}
        label={"Total Tasks"}
        slices={getEmptyTaskData()}
        unit={total} />
    );
  },

  render: function() {
    var tasks = this.getTasks(this.props.tasks);

    return (
      <div className="chart">
        <div className="row">
          <div className="column-small-offset-1 column-small-10">
            <Chart calcHeight={function (w) { return w; }}>
              {this.getDialChart(tasks)}
            </Chart>
          </div>
        </div>
        <div className="row">
          {this.getTaskInfo(tasks)}
        </div>
      </div>
    );
  }

});

module.exports = TasksChart;
