import _ from "underscore";

import List from "./List";
import Item from "./Item";

const PAGE_SIZE = 8 * 4096; // 8 "pages"
const DEFAULT_OPTIONS = {
  end: -1,
  initialized: false,
  start: -1,
  maxFileSize: 5000
};

export default class LogFile extends List {
  constructor(options = {}) {
    super(...arguments);

    this.options = _.extend(
      {},
      DEFAULT_OPTIONS,
      _.pick(options, ...Object.keys(DEFAULT_OPTIONS))
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

  add(entry) {
    let options = this.options;
    let data = entry.get("data");
    let end = options.end;
    // The point we are reading from in the log file
    let offset = entry.get("offset");
    let start = options.start;

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

    // Update start to be the new end minus our file window
    if (data.length >= options.maxFileSize) {
      start = end - options.maxFileSize;
    }

    // Update options and add log entry
    this.options.end = end;
    this.options.start = start;
    super.add(new Item({data, offset}));
  }

  initialize(entry) {
    let end = this.options.end; // pointing to end of visible log
    let offset = entry.offset; // The point we are reading from in the log file
    let start = this.options.start; // pointing to start of visible log

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

  unInitialize() {
    this.options.initialized = false;
  }

  getEnd() {
    return this.options.end;
  }

  getInitialized() {
    return this.options.initialized;
  }

  getFullLog() {
    return this.getItems().map(function (item) {
      return item.get("data");
    }).join("");
  }
}
