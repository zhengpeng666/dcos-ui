import Item from './Item';

class DirectoryItem extends Item {
  getName() {
    return this.get('path').replace(/^.*\//, '');
  }

  isDirectory() {
    // DirectoryItem is a directory if nlink is greater than 1.
    return this.get('nlink') > 1;
  }
}

module.exports = DirectoryItem;
