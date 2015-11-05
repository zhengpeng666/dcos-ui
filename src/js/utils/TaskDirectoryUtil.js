const TaskDirectoryUtil = {
  isDirectory(file) {
    return file.nlink > 1;
  }
};

module.exports = TaskDirectoryUtil;
