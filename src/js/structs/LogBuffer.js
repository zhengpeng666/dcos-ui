import _ from 'underscore';

import List from './List';
import Item from './Item';

const PAGE_SIZE = 8 * 4096;  // 32kb of data or 8 'pages'
const DEFAULT_OPTIONS = {
  end: -1,
  initialized: false,
  maxFileSize: 50000,
  start: -1
};

export default class LogBuffer extends List {
  constructor(options = {}) {
    super(...arguments);

    this.configuration = _.defaults(
      _.pick(options, ...Object.keys(DEFAULT_OPTIONS)),
      DEFAULT_OPTIONS
    );

    // Replace list items instances of Item.
    this.list = this.list.map(function (item) {
      if (item instanceof Item) {
        return item;
      } else {
        return new Item(item);
      }
    });
  }

  // Public API
  initialize(offset) { // The point we are reading from in the log file
    let end = this.getEnd(); // pointing to end of currently stored log
    let start = this.getStart(); // pointing to start of currently stored log

    // Get the last page of data.
    if (offset > PAGE_SIZE) {
      start = end = offset - PAGE_SIZE;
    } else {
      start = end = 0;
    }

    this.configuration.initialized = true;
    this.configuration.start = start;
    this.configuration.end = end;
  }

  add(entry) {
    let data = entry.get('data');
    let end = this.getEnd();
    // The point we are reading from in the log file
    let offset = entry.get('offset');
    let start = this.getStart();

    // Truncate to the first newline from beginning of received data,
    // if this is the first request and the data received is not from the
    // beginning of the log
    if (start === end && offset !== 0) {
      let index = data.indexOf('\n') + 1;
      offset += index;
      data = data.substring(index);
      start = offset; // Adjust the actual start too!
    }

    // Update end to be offset + new addition to the log
    this.configuration.end = offset + data.length;
    this.configuration.start = start;

    // Add log entry
    super.add(new Item({data, offset}));
    // Truncate log file to make sure we are within maxFileSize
    this.truncate();
  }

  getEnd() {
    return this.configuration.end;
  }

  getFullLog() {
    return this.getItems().map(function (item) {
      return item.get('data');
    }).join('');
  }

  getStart() {
    return this.configuration.start;
  }

  isInitialized() {
    return this.configuration.initialized;
  }

  /**
   * Truncates the log from beginning of file, to be within
   * boundaries given by maxFileSize
   * It will also truncate the data of the 'oldest item to stay in log',
   * to the first newline index
   */
  truncate() {
    let end = this.getEnd();
    let maxFileSize = this.configuration.maxFileSize;

    if (end - this.getStart() < maxFileSize) {
      // We are within size, so we don't have to truncate anything
      return;
    }

    let items = this.getItems();
    let index = items.length - 1;
    let size = 0;
    for (; index >= 0; index--) {
      let item = items[index];
      let itemData = item.get('data');
      size += itemData.length;

      if (size > maxFileSize) {
        let sizeDiff = size - maxFileSize;
        // Truncate to fit within maxFileSize
        itemData = itemData.substring(sizeDiff);
        // Truncate to first newline
        let newLineIndex = itemData.indexOf('\n') + 1;
        itemData = itemData.substring(newLineIndex);
        // Update size accordingly
        size -= sizeDiff + newLineIndex;
        items[index] = new Item({
          data: itemData,
          offset: item.get('offset')
        });
        break;
      }
    }

    // Update start to be the new end minus our file window
    this.configuration.start = end - size;
    if (index > 0) {
      this.list = this.list.slice(index);
    }
  }
}
