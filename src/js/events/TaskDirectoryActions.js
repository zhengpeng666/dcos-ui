import _ from "underscore";

import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import MesosStateStore from "../stores/MesosStateStore";
import RequestUtil from "../utils/RequestUtil";

var TaskDirectoryActions = {
  getFilePathURL: function (nodeID) {
    return `/slave/${nodeID}/files/browse.json`;
  },

  getDownloadURL: function (nodeID, path) {
    return `/slave/${nodeID}/files/download.json?path=${path}`;
  },

  getNodeStateJSON: function (task) {
    let pid = MesosStateStore.getNodeFromID(task.slave_id).pid;
    let nodePID = pid.substring(0, pid.indexOf("@"));

    return `slave/${task.slave_id}/${nodePID}/state.json`;
  },

  getInnerPath: function (nodeState, task, innerPath) {
    innerPath = innerPath || "";

    let taskFramework = _.find(nodeState.frameworks, function (framework) {
      return framework.id === task.framework_id;
    });

    let taskExecutor = _.find(taskFramework.executors, function (executor) {
      return _.some(executor.tasks, function (executorTask) {
        return executorTask.id === task.id;
      });
    });

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
  ),

  fetchDirectory: function (task, innerPath, nodeState) {
    RequestUtil.json({
      url: TaskDirectoryActions.getFilePathURL(task.slave_id),
      data: {
        path: TaskDirectoryActions.getInnerPath(nodeState, task, innerPath)
      },
      success: function (directory) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_TASK_DIRECTORY_SUCCESS,
          data: directory
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_TASK_DIRECTORY_ERROR,
          data: e.message
        });
      }
    });
  }

};

module.exports = TaskDirectoryActions;
