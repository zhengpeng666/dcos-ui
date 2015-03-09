/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var DialChart = require("./DialChart");

var tasksPerRow = 3;
var taskLabels = {
  "TASK_FAILED": "Tasks failed",
  "TASK_FINISHED:": "Tasks finished",
  "TASK_KILLED": "Tasks killed",
  "TASK_LOST": "Tasks lost",
  "TASK_RUNNING": "Tasks running",
  "TASK_STAGING": "Tasks staging",
  "TASK_STARTING": "Tasks startingg"
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
    return _.map(this.props.tasks, function (task, i) {
      return {colorIndex: i, name: task.state, value: task.tasks.length};
    });
  },

  render: function() {
    var tasks = this.getTasks();
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="panel">
        <div className="panel-heading text-align-center">
          <h3 className="panel-title">
            Tasks
          </h3>
        </div>
        <div className="panel-content">
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
      </div>
    );
  }

});

module.exports = TasksChart;
