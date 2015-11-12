var React = require("react");

var Actions = require("../actions/Actions");
var CliInstallModal = require("./modals/CliInstallModal");
var Config = require("../config/Config");
var ErrorModal = require("./modals/ErrorModal");
var EventTypes = require("../constants/EventTypes");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var LocalStorageUtil = require("../utils/LocalStorageUtil");
var LoginModal = require("./modals/LoginModal");
var MesosSummaryStore = require("../stores/MesosSummaryStore");
import plugins from "../plugins/index";
var SidebarStore = require("../stores/SidebarStore");
var VersionsModal = require("./modals/VersionsModal");

var Modals = React.createClass({

  displayName: "Modals",

  mixins: [InternalStorageMixin],

  propTypes: {
    showErrorModal: React.PropTypes.bool,
    modalErrorMsg: React.PropTypes.node
  },

  getDefaultProps: function () {
    return {
      showErrorModal: false,
      modalErrorMsg: ""
    };
  },

  getInitialState: function () {
    var props = this.props;

    return {
      hasIdentity: false,
      modalErrorMsg: props.modalErrorMsg,
      showingCliModal: false,
      showingTourModal: false,
      showingVersionsModal: false,
      showErrorModal: props.showErrorModal,
      tourSetup: false
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({
      modalErrorMsg: props.modalErrorMsg,
      showErrorModal: props.showErrorModal
    });
  },

  componentWillMount: function () {
    var email = LocalStorageUtil.get("email");
    if (email != null) {
      this.setState({
        hasIdentity: true
      });
    }
  },

  componentDidMount: function () {
    SidebarStore.addChangeListener(
      EventTypes.SHOW_CLI_INSTRUCTIONS, this.handleShowCli
    );

    SidebarStore.addChangeListener(
      EventTypes.SHOW_TOUR, this.handleTourStart
    );

    SidebarStore.addChangeListener(
      EventTypes.SHOW_VERSIONS_SUCCESS, this.handleShowVersionsSuccess
    );

    SidebarStore.addChangeListener(
      EventTypes.SHOW_VERSIONS_ERROR, this.handleShowVersionsError
    );
  },

  componentWillUnmount: function () {
    SidebarStore.removeChangeListener(
      EventTypes.SHOW_CLI_INSTRUCTIONS, this.handleShowCli
    );

    SidebarStore.removeChangeListener(
      EventTypes.SHOW_TOUR, this.handleTourStart
    );

    SidebarStore.removeChangeListener(
      EventTypes.SHOW_VERSIONS_SUCCESS, this.handleShowVersionsSuccess
    );

    SidebarStore.removeChangeListener(
      EventTypes.SHOW_VERSIONS_ERROR, this.handleShowVersionsError
    );
  },

  handleShowVersionsSuccess: function () {
    this.setState({showingVersionsModal: true});
  },

  handleShowVersionsError: function () {
    this.setState({
      showErrorModal: true,
      modalErrorMsg: (
        <p className="text-align-center flush-bottom">
          We are unable to retreive the version DCOS versions. Please try again.
        </p>
      )
    });
  },

  handleShowCli: function () {
    this.setState({showingCliModal: true});
  },

  handleTourStart: function () {
    this.setState({showingTourModal: true});
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
    let statesReady = MesosSummaryStore.get("statesProcessed");
    let isOpen = plugins.applyFilter(
      "isLoginModalOpen",
      (!hasIdentity && !Config.disableLoginModal && statesReady)
    );

    if (isOpen) {
      Actions.logFakePageView({
        title: "Signup Modal",
        path: "/v/beta-signup-modal-form",
        referrer: "https://mesosphere.com/"
      });
    }
    return (
      <LoginModal
        onLogin={this.onLogin}
        open={isOpen} />
    );
  },

  getCliModalOptions: function () {
    return {
      onClose: function () {
          this.setState({showingCliModal: false});
        }.bind(this),
      title: "Install the DCOS CLI",
      showFooter: false
    };
  },

  getTourModalOptions: function () {
    var onClose = function () {
      this.setState({showingTourModal: false});
    }.bind(this);

    var beginTour = function () {
      onClose();

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
      onClose: onClose,
      title: "Welcome to the Mesosphere DCOS",
      subHeaderContent: "In order to get started, you'll need to install our command-line tool by copying the snippet below. After that, you'll take our tour which will guide you through installing a web-app and continuous integration pipeline.",
      showFooter: true,
      footer: (
        <div className="tour-start-modal-footer">
          <div className="row text-align-center">
            <button className="button button-primary button-large" onClick={beginTour}>
              Start The Tour
            </button>
          </div>
          <div className="row text-align-center">
            <a onClick={onClose} className="clickable skip-tour">
              {"No thanks, I'll skip the tour."}
            </a>
          </div>
        </div>
      )
    };
  },

  getCliInstallModal: function (showModal) {
    var options = {
      onClose: function () {},
      title: "",
      subHeaderContent: "",
      showFooter: true,
      footer: {}
    };

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
      <CliInstallModal open={showModal} {...options} />
    );
  },

  getVersionsModal: function (showModal) {
    var onClose = function () {
      this.setState({showingVersionsModal: false});
    }.bind(this);

    var versions = SidebarStore.get("versions");
    return (
      <VersionsModal
        onClose={onClose}
        versionDump={versions}
        open={showModal} />
    );
  },

  getErrorModal: function (show) {
    var onClose = function () {
      this.setState({showErrorModal: false});
    }.bind(this);

    var errorMsg = null;
    if (this.state.modalErrorMsg) {
      errorMsg = this.state.modalErrorMsg;
    }

    return (
      <ErrorModal
        onClose={onClose}
        errorMsg={errorMsg}
        open={show} />
    );
  },

  render: function () {
    var showCliModal = this.state.showingCliModal ||
      this.state.showingTourModal;

    return (
      <div>
        {this.getLoginModal(this.state.hasIdentity)}
        {this.getCliInstallModal(showCliModal)}
        {this.getVersionsModal(this.state.showingVersionsModal)}
        {this.getErrorModal(this.state.showErrorModal)}
      </div>
    );
  }
});

module.exports = Modals;
