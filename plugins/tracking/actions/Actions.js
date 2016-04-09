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

  metadataLoaded: function () {
    let metadata = SDK.Store.getAppState().metadata;
    return (metadata &&
      metadata.dcosMetadata &&
      metadata.metadata &&
      metadata.metadata.CLUSTER_ID);
  },

  listenForDcosMetadata: function () {
    if (!this.metadataLoaded()) {
      let unSubscribe = SDK.Store.subscribe(() => {
        if (this.metadataLoaded()) {
          unSubscribe();
          this.setDcosMetadata(this.mergeMetaData());
        }
      });
    } else {
      this.setDcosMetadata(this.mergeMetaData());
    }
  },

  mergeMetaData: function () {
    return _.extend({}, SDK.Store.getAppState().metadata.dcosMetadata,
      {clusterId: SDK.Store.getAppState().metadata.metadata.CLUSTER_ID});
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

  getLogData: function () {
    return _.extend({
      appVersion: Config.version,
      version: '@@VERSION'
    }, this.dcosMetadata);
  },

  identify: function (uid) {
    if (!this.canLog()) {
      // Try again
      setTimeout(() => {
        this.identify(uid);
      }, 500);

      return;
    }

    global.analytics.identify(uid, this.getLogData());

    this.log('dcos_login');
  },

  logPage: function (path) {
    if (!this.canLog()) {
      this.pageQueue.push(path);
      return;
    }

    let data = _.extend(this.getLogData(), {path});
    global.analytics.page(data);
  },

  /**
   * Logs arbitriary data
   * @param  {String} eventID
   */
  log: function (eventID) {
    if (!this.canLog()) {
      this.logQueue.push(eventID);
      return;
    }

    // Populates with basic data that all logs need
    var log = this.getLogData();

    global.analytics.track(eventID, log);
  }

};

module.exports = Actions;
