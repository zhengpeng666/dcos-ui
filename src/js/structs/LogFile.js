import _ from "underscore";

import List from "./List";
import Item from "./Item";

const PAGE_SIZE = 8 * 4096; // 8 "pages"
const DEFAULT_OPTIONS = {
  end: -1,
  initialized: false,
  maxFileSize: 5000,
  start: -1
};

export default class LogFile extends List {
  constructor(options = {}) {
    super(...arguments);

    this.options = _.defaults(
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

  initialize(entry) {
    let end = this.options.end; // pointing to end of currently stored log
    let offset = entry.offset; // The point we are reading from in the log file
    let start = this.options.start; // pointing to start of currently stored log

    // Get the last page of data.
    if (offset > PAGE_SIZE) {
      start = end = offset - PAGE_SIZE;
    } else {
      start = end = 0;
    }

    this.options.initialized = true;
    this.options.start = start;
    this.options.end = end;
  }

  add(entry) {
    let data = entry.get("data");
    let end = this.getEnd();
    // The point we are reading from in the log file
    let offset = entry.get("offset");
    let start = this.getStart();

    // Truncate to the first newline from beginning of received data,
    // if this is the first request and the data received is not from the
    // beginning of the log
    if (start === end && offset !== 0) {
      let index = data.indexOf("\n") + 1;
      offset += index;
      data = data.substring(index);
      start = offset; // Adjust the actual start too!
    }

    // Update end to be offset + new addition to the log
    end = offset + data.length;

    // Update options and add log entry
    this.options.end = end;
    this.options.start = start;

    super.add(new Item({data, offset}));
    // Truncate log file to make sure we are within maxFileSize
    this.truncate();
  }

  /**
   * Truncates the log from beginning of file, to be within
   * boundaries given by maxFileSize
   * It will also truncate the data of the 'oldest item to stay in log',
   * to the first newline index
   */
  truncate() {
    let end = this.getEnd();
    let maxFileSize = this.getMaxFileSize();

    if (end - this.getStart() < maxFileSize) {
      // We are within size, so we don't have to truncate anything
      return;
    }

    let items = this.getItems();
    let index = items.length - 1;
    let size = 0;
    for (; index >= 0; index--) {
      let item = items[index];
      let itemData = item.get("data");
      size += itemData.length;

      if (size > maxFileSize) {
        let sizeDiff = size - maxFileSize;
        // Truncate to fit within maxFileSize
        itemData = itemData.substring(sizeDiff);
        // Truncate to first newline
        let newLineIndex = itemData.indexOf("\n") + 1;
        itemData = itemData.substring(newLineIndex);
        // Update size accordingly
        size -= sizeDiff + newLineIndex;
        items[index] = new Item({
          data: itemData,
          offset: item.get("offset")
        });
        break;
      }
    }

    // Update start to be the new end minus our file window
    this.options.start = end - size;
    if (index > 0) {
      this.list = this.list.slice(index);
    }
  }

  unInitialize() {
    this.options.initialized = false;
  }

  getEnd() {
    return this.options.end;
  }

  getFullLog() {
    return this.getItems().map(function (item) {
      return item.get("data");
    }).join("");
  }

  getInitialized() {
    return this.options.initialized;
  }

  getMaxFileSize() {
    return this.options.maxFileSize;
  }

  getStart() {
    return this.options.start;
  }

}
