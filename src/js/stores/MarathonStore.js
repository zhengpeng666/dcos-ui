var _ = require("underscore");

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var Config = require("../config/Config");
var EventTypes = require("../constants/EventTypes");
var HealthTypes = require("../constants/HealthTypes");
var MarathonActions = require("../events/MarathonActions");
var ServiceImages = require("../constants/ServiceImages");
var Store = require("../utils/Store");

var requestInterval = null;

function startPolling() {
  if (requestInterval == null) {
    MarathonActions.fetchApps();
    requestInterval = global.setInterval(
      MarathonActions.fetchApps, Config.stateRefresh
    );
  }
}

function stopPolling() {
  if (requestInterval != null) {
    global.clearInterval(requestInterval);
    requestInterval = null;
  }
}

var MarathonStore = Store.createStore({

  apps: {},

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);

    if (eventName === EventTypes.MARATHON_APPS_CHANGE) {
      startPolling();
    }
  },

  getApps: function () {
    return this.apps;
  },

  getFrameworkHealth: function (app) {
    if (app.healthChecks == null || app.healthChecks.length === 0) {
      return null;
    }

    var health = {key: "IDLE", value: HealthTypes.IDLE};
    if (app.tasksUnhealthy > 0) {
      health = {key: "UNHEALTHY", value: HealthTypes.UNHEALTHY};
    } else if (app.tasksRunning > 0 && app.tasksHealthy === app.tasksRunning) {
      health = {key: "HEALTHY", value: HealthTypes.HEALTHY};
    }

    return health;
  },

  getServiceHealth: function (name) {
    let appName = name.toLowerCase();
    let appHealth = {
      key: "NA",
      value: HealthTypes.NA
    };

    if (this.apps[appName]) {
      appHealth = this.apps[appName].health;
    }

    return appHealth;
  },

  getServiceImages: function (name) {
    let appName = name.toLowerCase();
    let appImages = null;

    if (this.apps[appName]) {
      appImages = this.apps[appName].images;
    }

    return appImages;
  },

  getImageSizeFromMetadata: function (metadata, size) {
    if (metadata.images == null ||
      metadata.images[`icon-${size}`] == null ||
      metadata.images[`icon-${size}`].length === 0) {
      return null;
    }

    return metadata.images[`icon-${size}`];
  },

  getFrameworkImages: function (app) {
    if (app.labels == null ||
      app.labels.DCOS_PACKAGE_METADATA == null ||
      app.labels.DCOS_PACKAGE_METADATA.length === 0) {
      return null;
    }

    var metadata = this.parseMetadata(app.labels.DCOS_PACKAGE_METADATA);

    if (this.getImageSizeFromMetadata(metadata, "small") == null ||
        this.getImageSizeFromMetadata(metadata, "medium") == null ||
        this.getImageSizeFromMetadata(metadata, "large") == null) {
      return ServiceImages.NA_IMAGES;
    }

    return metadata.images;
  },

  processMarathonApps: function (data) {
    var apps = {};
    _.each(data.apps, function (app) {
      if (app.labels.DCOS_PACKAGE_FRAMEWORK_NAME == null) {
        return;
      }

      var packageName = app.labels.DCOS_PACKAGE_FRAMEWORK_NAME;

      // Use insensitive check
      if (packageName.length) {
        packageName = packageName.toLowerCase();
      }

      apps[packageName] = {
        health: this.getFrameworkHealth(app),
        images: this.getFrameworkImages(app)
      };
    }, this);

    // Specific health check for Marathon
    // We are setting the "marathon" key here, since we can safely assume,
    // it to be "marathon" (we control it).
    // This means that no other framework should be named "marathon".
    apps.marathon = {
      health: this.getFrameworkHealth({
        // Make sure health check has a result
        healthChecks: [{}],
        // Marathon is healthy if this request returned apps
        tasksHealthy: data.apps.length,
        tasksRunning: data.apps.length
      }),
      images: ServiceImages.MARATHON_IMAGES
    };

    this.apps = apps;

    this.emit(EventTypes.MARATHON_APPS_CHANGE, this.apps);
  },

  processMarathonAppsError: function () {
    this.emit(EventTypes.MARATHON_APPS_ERROR);
  },

  parseMetadata: function (b64Data) {
    // extract content of the DCOS_PACKAGE_METADATA label
    try {
      var dataAsJsonString = global.atob(b64Data);
      return JSON.parse(dataAsJsonString);
    } catch (error) {
      return {};
    }
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);

    if (_.isEmpty(this.listeners(EventTypes.MARATHON_APPS_CHANGE))) {
      stopPolling();
    }
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    var action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_MARATHON_APPS_SUCCESS:
        MarathonStore.processMarathonApps(action.data);
        break;
      case ActionTypes.REQUEST_MARATHON_APPS_ERROR:
        MarathonStore.processMarathonAppsError();
        break;
    }

    return true;
  })

});

module.exports = MarathonStore;
