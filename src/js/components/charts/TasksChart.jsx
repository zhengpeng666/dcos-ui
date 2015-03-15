/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var DialChart = require("./DialChart");

var tasksPerRow = 3;
var taskLabels = {
  "TASK_RUNNING": "Tasks running",
  "TASK_STAGING": "Tasks staging"
};

var TasksChart = React.createClass({

  displayName: "TasksChart",

  propTypes: {
    // [{state: "TASK_RUNNING", tasks: [{id: "askdfja", name: "datanode"}]}]
    tasks: React.PropTypes.array.isRequired
  },

  getTaskInfo: function (tasks) {
    var numberOfTasks = tasks.length;
    var leftover = numberOfTasks % tasksPerRow;

    return _.map(tasks, function (task, i) {
      var classes = {
        "text-align-center": true
      };
      // equalize columns for units
      if (i < numberOfTasks - leftover) {
        classes["column-small-4"] = true;
      } else {
        classes["column-small-" + 12 / leftover] = true;
      }
      var classSet = React.addons.classSet(classes);
      return (
        <div key={i} className={classSet}>
          <p className="h1 unit">
            {task.value}
          </p>
          <p className={"unit-label path-color-" + i}>
            {taskLabels[task.name]}
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

  getTasks: function () {
    var keys = _.keys(taskLabels);
    var starting = 0;
    return _.chain(this.props.tasks)
      .filter(function (task) {
        // save starting tasks for use later
        if (task.state === "TASK_STARTING") {
          starting = task.tasks.length;
        }
        return _.contains(keys, task.state);
      })
      .sortBy("state")
      .map(function (task, i) {
        var value = task.tasks.length;
        // add starting to staging
        if (task.state === "TASK_STAGING") {
          value = starting + task.tasks.length;
        }
        return {colorIndex: i, name: task.state, value: value};
      }
    ).value();
  },

  render: function() {
    var tasks = this.getTasks();
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div>
        <div className="row">
          <div className="column-small-offset-1 column-small-10">
            <Chart calcHeight={function (w) { return w; }}>
              <DialChart
                data={tasks}
                label={"Total Tasks"}
                unit={this.getTotal(tasks)} />
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
