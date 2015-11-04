var TaskUtil = {

  getTaskStatusClassName(task) {
    let taskStatus = task.state.substring("TASK_".length).toLowerCase();
    return `task-status-${taskStatus}`;
  }

};

module.exports = TaskUtil;
