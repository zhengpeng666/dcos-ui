const TaskDirectoryURLUtil = {
  getFilePathURL(nodeID) {
    return `/slave/${nodeID}/files/browse.json`;
  },

  getDownloadURL(nodeID, path) {
    return `/slave/${nodeID}/files/download.json?path=${path}`;
  },

  getNodeStateJSON(nodeID, nodePID) {
    return `slave/${nodeID}/${nodePID}/state.json`;
  }
};

module.exports = TaskDirectoryURLUtil;
