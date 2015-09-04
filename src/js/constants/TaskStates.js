const TaskStates = {
  active: ["TASK_STAGING", "TASK_STARTING", "TASK_RUNNING"],
  completed: ["TASK_FAILED", "TASK_KILLED", "TASK_LOST", "TASK_ERROR", "TASK_FINISHED"],

  successStates: ["TASK_STAGING", "TASK_STARTING", "TASK_RUNNING", "TASK_FINISHED"],
  failureStates: ["TASK_FAILED", "TASK_KILLED", "TASK_LOST", "TASK_ERROR"],

  allStates: [
    "TASK_STAGING",
    "TASK_STARTING",
    "TASK_RUNNING",
    "TASK_FAILED",
    "TASK_KILLED",
    "TASK_LOST",
    "TASK_ERROR",
    "TASK_FINISHED"
  ]
};

module.exports = TaskStates;
