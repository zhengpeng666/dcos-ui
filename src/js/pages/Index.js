/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var AnimatedLogo = require("../components/AnimatedLogo");
var Actions = require("../actions/Actions");
var CliInstallModal = require("../components/modals/CliInstallModal");
var Config = require("../config/Config");
var ErrorModal = require("../components/modals/ErrorModal");
var EventTypes = require("../constants/EventTypes");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var IntercomStore = require("../stores/IntercomStore");
var LocalStorageUtil = require("../utils/LocalStorageUtil");
var LoginModal = require("../components/modals/LoginModal");
var MesosStateStore = require("../stores/MesosStateStore");
var RequestErrorMsg = require("../components/RequestErrorMsg");
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
      showIntercom: IntercomStore.isOpen(),
      hasIdentity: false,
      mesosSummaryErrorCount: 0,
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
      Actions.identify(email, function () {
        IntercomStore.init();
      });

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

    IntercomStore.addChangeListener(
      EventTypes.INTERCOM_CHANGE, this.onIntercomChange
    );

    SidebarStore.addChangeListener(
      EventTypes.SHOW_VERSIONS_SUCCESS, this.onShowVersionsSuccess
    );

    SidebarStore.addChangeListener(
      EventTypes.SHOW_VERSIONS_ERROR, this.onShowVersionsError
    );

    this.addMesosStateListeners();
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) &&
        _.isEqual(this.state, nextState));
  },

  addMesosStateListeners: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_REQUEST_ERROR, this.onMesosSummaryError
    );
  },

  removeMesosStateListeners: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_REQUEST_ERROR, this.onMesosSummaryError
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

    IntercomStore.removeChangeListener(
      EventTypes.INTERCOM_CHANGE, this.onIntercomChange
    );

    SidebarStore.removeChangeListener(
      EventTypes.SHOW_VERSIONS_SUCCESS, this.onShowVersionsSuccess
    );

    SidebarStore.removeChangeListener(
      EventTypes.SHOW_VERSIONS_ERROR, this.onShowVersionsError
    );

    this.removeMesosStateListeners();

    MesosStateStore.unmount();
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

  onIntercomChange: function () {
    var intercom = global.Intercom;
    if (intercom != null) {
      this.setState({showIntercom: IntercomStore.isOpen()});
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

  onMesosSummaryChange: function () {
    var state = getMesosState();
    // if state is processed, stop listening
    if (state.statesProcessed) {
      this.removeMesosStateListeners();
    }

    this.internalStorage_update(state);

    // Reset count as we've just received a successful response
    if (this.state.mesosSummaryErrorCount > 0) {
      this.setState({mesosSummaryErrorCount: 0});
    } else {
      this.forceUpdate();
    }
  },

  onMesosSummaryError: function () {
    this.setState({
      mesosSummaryErrorCount: this.state.mesosSummaryErrorCount + 1
    });
  },

  getLoadingScreen: function (showLoading) {
    if (!showLoading) {
      return null;
    }

    var hasLoadingError = this.state.mesosSummaryErrorCount >= 3;
    var errorMsg = null;
    if (hasLoadingError) {
      errorMsg = <RequestErrorMsg />;
    }

    var loadingClassSet = React.addons.classSet({
      "hidden": hasLoadingError
    });

    return (
      <div className="text-align-center vertical-center">
        <div className="row">
          <div className={loadingClassSet}>
            <AnimatedLogo speed={500} scale={0.16} />
          </div>
          {errorMsg}
        </div>
      </div>
    );
  },

  onLogin: function (email) {
    LocalStorageUtil.set("email", email);
    Actions.identify(email);
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
      subHeaderContent: "This tutorial walks you through using the DCOS Dashboard, including installing a service, deploying and scaling an app, and performing continuous integration. It should take about 10 minutes to complete.",
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
      subHeaderContent: "In order to get started, you'll need to install our command-line tool by copying the snippet below. After that, you'll take our tour which will guide you through installing a web-app and continuous integration pipeline.",
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
        title: "CLI instructions",
        path: "/v/cli-instructions",
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

  renderIntercom: function () {
    var intercom = global.Intercom;
    if (intercom != null) {
      if (this.state.showIntercom) {
        intercom("show");
      } else {
        intercom("hide");
      }
    }
  },

  render: function () {
    var data = this.internalStorage_get();
    var isReady = data.statesProcessed;
    var showCliModal = this.state.showingCliModal ||
      this.state.showingTourModal;

    var classSet = React.addons.classSet({
      "canvas-sidebar-open": data.isOpen
    });

    this.renderIntercom();

    return (
      <div>
        <a id="start-tour"></a>
        <div id="canvas" className={classSet}>
          {this.getLoadingScreen(!isReady)}
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
