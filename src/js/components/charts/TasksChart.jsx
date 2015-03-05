/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var DialChart = require("./DialChart");

var TasksChart = React.createClass({

  displayName: "TasksChart",

  propTypes: {
    // [{state: "TASK_RUNNING", tasks: [{id: "askdfja", name: "datanode"}]}]
    tasks: React.PropTypes.array.isRequired
  },

  getTaskInfo: function (tasks) {
    var classes = {
      "text-align-center": true
    };
    classes["column-small-" + Math.floor(12/tasks.length)] = true;

    var classSet = React.addons.classSet(classes);
    return _.map(tasks, function (task, i) {
        return (
          <div key={i} className={classSet}>
            <h5 className="unit">
              {task.value}
            </h5>
            <p className="unit-label">
              {task.name}
            </p>
          </div>
        );
      }
    );
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
                <DialChart data={tasks} />
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
