var _ = require('underscore');
var md5 = require('md5');
var RouterLocation = require('react-router').HashLocation;

let SDK = require('../SDK').getSDK();
let {Config, Util} = SDK.get(['Config', 'Util']);

var Actions = {
  activePage: '',

  previousFakePageLog: '',

  dcosMetadata: null,

  logQueue: [],

  pageQueue: [],

  actions: [
    'log',
    'logFakePageView'
  ],

  initialize: function () {
    this.actions.forEach(action => {
      SDK.Hooks.addAction(action, this[action].bind(this));
    });

    this.listenForDcosMetadata();
    this.start();
  },

  listenForDcosMetadata: function () {
    if (!(SDK.Store.getAppState().metadata &&
      SDK.Store.getAppState().metadata.dcosMetadata)) {
      let unSubscribe = SDK.Store.subscribe(() => {
        if (SDK.Store.getAppState().metadata &&
          SDK.Store.getAppState().metadata.dcosMetadata) {
          unSubscribe();
          this.setDcosMetadata(SDK.Store.getAppState().metadata.dcosMetadata);
        }
      });
    } else {
      this.setDcosMetadata(SDK.Store.getAppState().metadata.dcosMetadata);
    }
  },

  setDcosMetadata: function (metadata) {
    this.dcosMetadata = metadata;

    if (this.canLog()) {
      this.drainQueue();
    }
  },

  start: function () {
    this.createdAt = Date.now();
    this.lastLogDate = this.createdAt;
    this.stintID = md5(`session_${this.createdAt}`);

    this.setActivePage(this.getActivePage());

    RouterLocation.addChangeListener(Util.debounce(function (data) {
      Actions.setActivePage(data.path);
    }, 200));

    // Poll to deplete queue
    let checkAnalyticsReady = () => {
      setTimeout(() => {
        if (!this.canLog()) {
          checkAnalyticsReady();
        } else {
          this.drainQueue();
        }
      }, 200);
    };
    checkAnalyticsReady();
  },

  canLog: function () {
    return !!(global.analytics
      && global.analytics.initialized
      && this.dcosMetadata != null);
  },

  drainQueue: function () {
    this.logQueue.forEach(log => {
      this.log(log);
    });
    this.logQueue = [];

    this.pageQueue.forEach(path => {
      this.logPage(path);
    });
    this.pageQueue = [];
  },

  logFakePageView: function (fakePageLog) {
    if (!this.canLog()) {
      this.logQueue.push(fakePageLog);
      return;
    }

    if (_.isEqual(this.previousFakePageLog, fakePageLog)) {
      return;
    }

    this.logPage(fakePageLog);
    this.previousFakePageLog = fakePageLog;
  },

  setActivePage: function (path) {
    if (!this.canLog()) {
      this.pageQueue.push(path);
      return;
    }

    if (path[path.length - 1] === '/') {
      path = path.substring(0, path.length - 1);
    }

    this.activePage = path;
    this.logPage(path);
  },

  getActivePage: function () {
    return RouterLocation.getCurrentPath();
  },

  getStintID: function () {
    return this.stintID;
  },

  identify: function (uid) {
    if (!this.canLog()) {
      // Try again
      setTimeout(() => {
        this.identify(uid);
      }, 500);

      return;
    }

    global.analytics.identify(uid, this.dcosMetadata);

    this.log({
      eventID: 'Logged in'
    });
  },

  logPage: function (path) {
    if (!this.canLog()) {
      this.pageQueue.push(path);
      return;
    }

    let data = _.extend({}, this.dcosMetadata, {path});
    global.analytics.page(data);
  },

  /**
   * Logs arbitriary data
   * @param  {Object} anything
   */
  log: function (anything) {
    if (!this.canLog()) {
      this.logQueue.push(anything);
      return;
    }

    // Populates with basic data that all logs need
    var log = _.extend({
      appVersion: Config.version,
      eventID: '',
      date: Date.now(),
      page: this.activePage,
      stintID: this.stintID,
      version: '@@VERSION'
    }, this.dcosMetadata, anything);

    log = this.prepareLog(log);

    global.analytics.track('dcos-ui', log);
  },

  /**
   * Normalizes and prepares log object
   *
   * @param {Object} log
   * @return {Object} Formatted log
   */
  prepareLog: function (log) {
    // If the eventID is an array then prepend the current page
    // this assumes that we want a unique eventID for the log
    if (_.isArray(log.eventID)) {
      log.eventID.unshift(this.activePage.replace(/^\//, ''));
      log.eventID = log.eventID.join('.');
    }

    // Calculate the time since the last event
    log.duration = log.date - this.lastLogDate;
    this.lastLogDate = log.date;

    return log;
  }

};

module.exports = Actions;
