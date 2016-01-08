import Item from "./Item";

class File extends Item {
  isDirectory() {
    // File is a directory if nlink is greater than 1.
    return this.get("nlink") > 1;
  }
}

module.exports = File;
