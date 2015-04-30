var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var Actions = require("../actions/Actions");
var Config = require("../config/Config");
var LocalStorageUtil = require("../utils/LocalStorageUtil");
var EventTypes = require("../constants/EventTypes");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MesosStateStore = require("../stores/MesosStateStore");
var ErrorModal = require("../components/modals/ErrorModal");
var LoginModal = require("../components/modals/LoginModal");
var CliInstallModal = require("../components/modals/CliInstallModal");
var Sidebar = require("../components/Sidebar");
var SidebarActions = require("../events/SidebarActions");
var SidebarStore = require("../stores/SidebarStore");
var VersionsModal = require("../components/modals/VersionsModal");

function getMesosState() {
  return {
    statesProcessed: MesosStateStore.isStatesProcessed()
  };
}

function getSidebarState() {
  return {
    isOpen: SidebarStore.isOpen()
  };
}

var Index = React.createClass({

  displayName: "Index",

  mixins: [InternalStorageMixin],

  getInitialState: function () {
    return {
      hasIdentity: false,
      mesosStateErrorCount: 0,
      tourSetup: false,
      showingCliModal: false,
      showingTourModal: false,
      showingVersionsModal: false,
      showErrorModal: false,
      modalErrorMsg: ""
    };
  },

  componentWillMount: function () {
    this.internalStorage_set(getSidebarState());
    MesosStateStore.init();

    var email = LocalStorageUtil.get("email");
    if (email != null) {
      Actions.identify({email: email});
      this.setState({
        hasIdentity: true
      });
    }
  },

  componentDidMount: function () {
    SidebarStore.addChangeListener(
      EventTypes.SIDEBAR_CHANGE, this.onSideBarChange
    );
    window.addEventListener("resize", SidebarActions.close);

    SidebarStore.addChangeListener(
      EventTypes.SHOW_CLI_INSTRUCTIONS, this.onShowCli
    );

    SidebarStore.addChangeListener(
      EventTypes.SHOW_TOUR, this.onTourStart
    );

    SidebarStore.addChangeListener(
      EventTypes.SHOW_INTERCOM, this.onShowIntercom
    );

    SidebarStore.addChangeListener(
      EventTypes.SHOW_VERSIONS_SUCCESS, this.onShowVersionsSuccess
    );

    SidebarStore.addChangeListener(
      EventTypes.SHOW_VERSIONS_ERROR, this.onShowVersionsError
    );

    this.addMesosStateListeners();
  },

  addMesosStateListeners: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
    );
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR, this.onMesosStateError
    );
  },

  removeMesosStateListeners: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
    );
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR, this.onMesosStateError
    );
  },

  componentWillUnmount: function () {
    SidebarStore.removeChangeListener(
      EventTypes.SIDEBAR_CHANGE, this.onSideBarChange
    );
    window.removeEventListener("resize", SidebarActions.close);

    SidebarStore.removeChangeListener(
      EventTypes.SHOW_CLI_INSTRUCTIONS, this.onShowCli
    );

    SidebarStore.removeChangeListener(
      EventTypes.SHOW_TOUR, this.onTourStart
    );

    SidebarStore.removeChangeListener(
      EventTypes.SHOW_INTERCOM, this.onShowIntercom
    );

    SidebarStore.removeChangeListener(
      EventTypes.SHOW_VERSIONS_SUCCESS, this.onShowVersionsSuccess
    );

    SidebarStore.removeChangeListener(
      EventTypes.SHOW_VERSIONS_ERROR, this.onShowVersionsError
    );

    this.removeMesosStateListeners();
  },

  onSideBarChange: function () {
    this.internalStorage_update(getSidebarState());
    this.forceUpdate();
  },

  onShowCli: function () {
    this.setState({showingCliModal: true});
  },

  onTourStart: function () {
    this.setState({showingTourModal: true});
  },

  onShowIntercom: function () {
    var intercom = global.Intercom;
    if (intercom) {
      intercom("show");
    } else {
      this.setState({
        showErrorModal: true,
        modalErrorMsg: (
          <p className="text-align-center flush-bottom">
            We are unable to communicate with Intercom.io. It is possible that you have a browser plugin or extension that is blocking communication. If so, please disabled and try again.
          </p>
        )
      });
    }
  },

  onShowVersionsSuccess: function () {
    this.setState({showingVersionsModal: true});
  },

  onShowVersionsError: function () {
    this.setState({
      showErrorModal: true,
      modalErrorMsg: (
        <p className="text-align-center flush-bottom">
          We are unable to retreive the version DCOS versions. Please try again.
        </p>
      )
    });
  },

  onMesosStateChange: function () {
    var state = getMesosState();
    // if state is processed, stop listening
    if (state.statesProcessed) {
      this.removeMesosStateListeners();
    }

    this.internalStorage_update(state);

    // Reset count as we've just received a successful response
    if (this.state.mesosStateErrorCount > 0) {
      this.setState({mesosStateErrorCount: 0});
    } else {
      this.forceUpdate();
    }
  },

  onMesosStateError: function () {
    this.setState({mesosStateErrorCount: ++this.state.mesosStateErrorCount});
  },

  getErrorMsg: function () {
    return (
      <div className="column-small-8 column-small-offset-2 column-medium-6 column-medium-offset-3">
        <h3>
          Cannot Connect With The Server
        </h3>
        <p className="text-align-center">
          We have been notified of the issue, but would love to know more.
          Talk with us by clicking the bubble in the lower-right of your screen.
          You can also join us on our&nbsp;
          <a href="https://mesosphere.slack.com/messages/dcos-eap-public"
              target="_blank">
            Slack channel
          </a> or send us an email at&nbsp;
          <a href="mailto:support@mesosphere.io">
            support@mesosphere.io
          </a>.
        </p>
      </div>
    );
  },

  getLoadingScreen: function (isReady) {
    if (isReady) {
      return null;
    }
    var hasLoadingError = this.state.mesosStateErrorCount >= 3;
    var errorMsg = null;
    if (hasLoadingError) {
      errorMsg = this.getErrorMsg();
    }

    var loadingClassSet = React.addons.classSet({
      "hidden": hasLoadingError
    });

    return (
      <div className="container text-align-center vertical-center">
        <div className="row">
          <div className={loadingClassSet}>
            <div className="ball-scale">
              <div />
            </div>
          </div>
          {errorMsg}
        </div>
      </div>
    );
  },

  onLogin: function (email) {
    LocalStorageUtil.set("email", email);
    Actions.identify({email: email});
    this.setState({
      hasIdentity: true,
      showingTourModal: true
    });
  },

  getLoginModal: function (hasIdentity) {
    if (hasIdentity || Config.disableLoginModal) {
      return null;
    }

    Actions.logFakePageView({
      title: "Signup Modal",
      path: "/v/beta-signup-modal-form",
      referrer: "https://mesosphere.com/"
    });

    return (
      <LoginModal onLogin={this.onLogin} />
    );
  },

  getCliModalOptions: function () {
    return {
      onCloseClickFn: function () {
          this.setState({showingCliModal: false});
        }.bind(this),
      title: "Welcome to the Mesosphere DCOS!",
      subHeaderContent: "This brief tutorial walks you through the basics of the Mesosphere DCOS. It includes using the DCOS Dashboard, installing a service from the package repository, deploying and scaling an app using Marathon, and performing continuous integration using Jenkins. This tutorial should take about 10 minutes to complete.",
      showFooter: false
    };
  },

  getTourModalOptions: function () {
    var onCloseClickFn = function () {
      this.setState({showingTourModal: false});
    }.bind(this);

    var beginTour = function () {
      onCloseClickFn();

      Actions.logFakePageView({
        title: "Tour start",
        path: "/v/tour-start",
        referrer: "https://mesosphere.com/"
      });

      if (this.state.tourSetup === false) {
        // setup with user infor for their tracking
        global.chmln.setup({
          uid: Actions.getStintID(),
          version: Config.version
        });
        this.setState({tourSetup: true});
      } else {
        // Awful hack.
        document.getElementById("start-tour").click();
      }
    }.bind(this);

    return {
      onCloseClickFn: onCloseClickFn,
      title: "Welcome to the Mesosphere DCOS",
      subHeaderContent: "In order to get started, you'll need to install our command-line tool by copying the snippet below. After that, you can take our tour which will guide you through installing a web-app and continuous integration pipeline.",
      showFooter: true,
      footer: (
        <div className="tour-start-modal-footer">
          <div className="row text-align-center">
            <button className="button button-primary" onClick={beginTour}>
              Start The Tour
            </button>
          </div>
          <div className="row text-align-center">
            <a onClick={onCloseClickFn} className="clickable skip-tour">
              {"No thanks, I'll skip the tour."}
            </a>
          </div>
        </div>
      )
    };
  },

  getCliInstallModal: function (showModal) {
    if (showModal === false) {
      return null;
    }

    var options;

    if (this.state.showingCliModal) {
      Actions.logFakePageView({
        title: "Analytics instructions",
        path: "/v/analytics-instructions",
        referrer: "https://mesosphere.com/"
      });

      options = this.getCliModalOptions();
    } else if (this.state.showingTourModal) {
      Actions.logFakePageView({
        title: "Tour prompt",
        path: "/v/tour-prompt",
        referrer: "https://mesosphere.com/"
      });

      options = this.getTourModalOptions();
    }

    return (
      <CliInstallModal
        onClose={options.onCloseClickFn}
        title={options.title}
        subHeaderContent={options.subHeaderContent}
        showFooter={options.showFooter}
        footer={options.footer} />
    );
  },

  getVersionsModal: function (showModal) {
    if (showModal === false) {
      return null;
    }

    var onCloseClickFn = function () {
      this.setState({showingVersionsModal: false});
    }.bind(this);

    var versions = SidebarStore.getVersions();
    return (
      <VersionsModal onClose={onCloseClickFn} versionDump={versions} />
    );
  },

  getErrorModal: function (show) {
    if (show === false) {
      return null;
    }

    var onCloseClickFn = function () {
      this.setState({showErrorModal: false});
    }.bind(this);

    return (<ErrorModal onClose={onCloseClickFn}
      errorMsg={this.state.modalErrorMsg} />);
  },

  render: function () {
    var data = this.internalStorage_get();
    var isReady = data.statesProcessed;
    var showCliModal = this.state.showingCliModal ||
      this.state.showingTourModal;

    var classSet = React.addons.classSet({
      "canvas-sidebar-open": data.isOpen
    });

    return (
      <div>
        <a id="start-tour"></a>
        <div id="canvas" className={classSet}>
          {this.getLoadingScreen(isReady)}
          <Sidebar />
          <RouteHandler />
        </div>
        {this.getLoginModal(this.state.hasIdentity)}
        {this.getCliInstallModal(showCliModal)}
        {this.getVersionsModal(this.state.showingVersionsModal)}
        {this.getErrorModal(this.state.showErrorModal)}
      </div>
    );
  }
});

module.exports = Index;
