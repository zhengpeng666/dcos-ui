import Item from "./Item";

class DirectoryItem extends Item {
  isDirectory() {
    // DirectoryItem is a directory if nlink is greater than 1.
    return this.get("nlink") > 1;
  }
}

module.exports = DirectoryItem;
