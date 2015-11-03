import _ from "underscore";

import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import MesosStateStore from "../stores/MesosStateStore";
import RequestUtil from "../utils/RequestUtil";
import TaskDirectoryURLUtil from "../utils/TaskDirectoryURLUtil";

var TaskDirectoryActions = {

  fetchState: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function (task, deeperPath) {
        deeperPath = deeperPath || "";
        let pid = MesosStateStore.getNodeFromID(task.slave_id).pid;
        let nodePID = pid.substring(0, pid.indexOf("@"));

        return RequestUtil.json({
          url: TaskDirectoryURLUtil.getNodeStateJSON(task.slave_id, nodePID),
          success: function (response) {
            let taskFramework = _.find(response.frameworks, function (framework) {
              return framework.id === task.framework_id;
            });

            let taskExecutor = _.find(taskFramework.executors, function (executor) {
              return _.some(executor.tasks, function (executorTask) {
                return executorTask.id === task.id;
              });
            });

            let directoryPath = taskExecutor.directory;

            RequestUtil.json({
              url: TaskDirectoryURLUtil.getFilePathURL(task.slave_id),
              data: {
                path: `${directoryPath}/${deeperPath}`
              },
              success: function (directory) {
                AppDispatcher.handleServerAction({
                  type: ActionTypes.REQUEST_TASK_DIRECTORY_SUCCESS,
                  data: directory
                });
                resolve();
              },
              error: function (e) {
                AppDispatcher.handleServerAction({
                  type: ActionTypes.REQUEST_TASK_DIRECTORY_ERROR,
                  data: e.message
                });
                reject();
              }
            });
          },

          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_TASK_DIRECTORY_ERROR,
              data: e.message
            });
            reject();
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  )

};

module.exports = TaskDirectoryActions;
