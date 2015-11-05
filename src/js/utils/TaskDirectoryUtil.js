const TaskDirectoryUtil = {
  isDirectory(file) {
    // File is a directory if nlink is greater than 1.
    return file.nlink > 1;
  }
};

module.exports = TaskDirectoryUtil;
