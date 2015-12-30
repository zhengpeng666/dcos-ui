import List from "./List";
import Item from "./Item";

const PAGE_SIZE = 8 * 4096; // 8 "pages"

export default class LogFile extends List {
  constructor(options = {}) {
    super(...arguments);

    // Replace list items instances of Item.
    this.list = this.list.map(function (item) {
      if (item instanceof Item) {
        return item;
      } else {
        return new Item(item);
      }
    });

    // pointing to end of visible log
    this.end = options.end || -1;
    this.initialized = options.initialized || false;
    // pointing to start of visible log
    this.start = options.start || -1;
    this.maxFileSize = options.maxFileSize || 5000;
  }

  add(entry) {
    let data = entry.get("data");
    let end = this.end;
    // The point we are reading from in the log file
    let offset = entry.get("offset");
    let start = this.start;

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
    this.end = offset + data.length;
    // Update start to be the new end minus our file window
    this.start = end - this.maxFileSize;
    super.add(new Item({data, offset}));
  }

  initialize(entry) {
    let end = this.end; // pointing to end of visible log
    let offset = entry.offset; // The point we are reading from in the log file
    let start = this.start; // pointing to start of visible log

    // Get the last page of data.
    if (offset > PAGE_SIZE) {
      start = end = offset - PAGE_SIZE;
    } else {
      start = end = 0;
    }

    this.initialized = true;
    this.start = start;
    this.end = end;
  }

  unInitialize() {
    this.initialized = false;
  }

  getEnd() {
    return this.end;
  }

  getInitialized() {
    return this.initialized;
  }

  getFullLog() {
    return this.getItems().map(function (item) {
      return item.get("data");
    }).join("");
  }
}
