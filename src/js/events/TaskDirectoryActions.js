import _ from "underscore";

import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
// TODO for mlunoe: We shouldn't be including stores in these files. DCOS-4430
import MesosStateStore from "../stores/MesosStateStore";
import RequestUtil from "../utils/RequestUtil";

var TaskDirectoryActions = {
  getDownloadURL: function (nodeID, path) {
    return `${Config.rootUrl}/slave/${nodeID}/files/download.json?` +
      `path=${path}`;
  },

  getNodeStateJSON: function (task) {
    let pid = MesosStateStore.getNodeFromID(task.slave_id).pid;
    let nodePID = pid.substring(0, pid.indexOf("@"));

    return `${Config.rootUrl}/slave/${task.slave_id}/${nodePID}/state.json`;
  },

  getInnerPath: function (nodeState, task, innerPath) {
    innerPath = innerPath || "";

    let taskFramework = _.find(nodeState.frameworks, function (framework) {
      return framework.id === task.framework_id;
    });

    if (!taskFramework) {
      return null;
    }

    function executorSearch(executor) {
      let found = null;

      function taskIDSearch(executorTask) {
        return executorTask.id === task.id;
      }

      found = _.some(executor.tasks, taskIDSearch);
      if (!found) {
        found = _.some(executor.completed_tasks, taskIDSearch);
      }

      return found;
    }

    // Search running executors
    let taskExecutor = _.find(taskFramework.executors, executorSearch);
    if (!taskExecutor) {
      // Search completed executors
      taskExecutor = _.find(taskFramework.completed_executors, executorSearch);
      if (!taskExecutor) {
        return null;
      }
    }

    return `${taskExecutor.directory}/${innerPath}`;
  },

  fetchNodeState: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function (task, cb) {
        return RequestUtil.json({
          url: TaskDirectoryActions.getNodeStateJSON(task),
          success: function (response) {
            resolve();
            cb(response);
          },
          error: function (xhr) {
            if (xhr.statusText === "abort") {
              resolve();
              return;
            }

            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_TASK_DIRECTORY_ERROR,
              data: xhr.message
            });

            reject();
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  ),

  fetchDirectory: function (task, innerPath, nodeState) {
    innerPath = TaskDirectoryActions.getInnerPath(nodeState, task, innerPath);
    if (innerPath == null) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_TASK_DIRECTORY_ERROR
      });
      return;
    }

    RequestUtil.json({
      url: `${Config.rootUrl}/slave/${task.slave_id}/files/browse.json`,
      data: {
        path: innerPath
      },
      success: function (directory) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_TASK_DIRECTORY_SUCCESS,
          data: directory
        });
      },
      error: function (xhr) {
        if (xhr.statusText === "abort") {
          return;
        }

        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_TASK_DIRECTORY_ERROR,
          data: xhr.message
        });
      }
    });
  }
};

module.exports = TaskDirectoryActions;
