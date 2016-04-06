var browserInfo = require('browser-info');
var React = require('react');

var CliInstallModal = require('./modals/CliInstallModal');
var ErrorModal = require('./modals/ErrorModal');
import EventTypes from '../constants/EventTypes';
import {Hooks} from 'PluginSDK';
var InternalStorageMixin = require('../mixins/InternalStorageMixin');
var SidebarStore = require('../stores/SidebarStore');
var VersionsModal = require('./modals/VersionsModal');

var Modals = React.createClass({

  displayName: 'Modals',

  mixins: [InternalStorageMixin],

  propTypes: {
    showErrorModal: React.PropTypes.bool,
    modalErrorMsg: React.PropTypes.node
  },

  getDefaultProps: function () {
    return {
      showErrorModal: false,
      modalErrorMsg: ''
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
      showErrorModal: props.showErrorModal
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({
      modalErrorMsg: props.modalErrorMsg,
      showErrorModal: props.showErrorModal
    });
  },

  componentWillMount: function () {
    this.setState({
      hasIdentity: Hooks.applyFilter('applicationHasIdentity', true)
    });
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
    Hooks.doAction('receivedUserEmail', email);

    this.setState({
      hasIdentity: true,
      showingTourModal: false
    });
  },

  getCliModalOptions: function () {
    return {
      onClose: function () {
          this.setState({showingCliModal: false});
        }.bind(this),
      title: 'Install the DCOS CLI',
      showFooter: false
    };
  },

  getTourModalOptions: function () {
    var onClose = function () {
      this.setState({showingTourModal: false});
    }.bind(this);

    let OS = browserInfo().os;
    let subHeaderContent = '';

    if (OS !== 'Windows') {
      let appendText = Hooks.applyFilter(
        'installCLIModalAppendInstructions', ''
      );
      subHeaderContent = `Install the DCOS command-line interface (CLI) tool on your local system by copying and pasting the code snippet below into your terminal. ${appendText}`;
    }

    return {
      onClose,
      title: 'Welcome to the Mesosphere DCOS',
      subHeaderContent,
      showFooter: true,
      footer: Hooks.applyFilter('installCLIModalFooter', (
        <div className="tour-start-modal-footer">
          <div className="row text-align-center">
            <button className="button button-primary button-medium" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      ), onClose)
    };
  },

  getCliInstallModal: function (showModal) {
    var options = {
      onClose: function () {},
      title: '',
      subHeaderContent: '',
      showFooter: true,
      footer: <div></div>
    };

    if (this.state.showingCliModal) {
      Hooks.doAction('logFakePageView', {
        title: 'CLI instructions',
        path: '/v/cli-instructions',
        referrer: 'https://mesosphere.com/'
      });

      options = this.getCliModalOptions();
    } else if (this.state.showingTourModal) {
      Hooks.doAction('logFakePageView', {
        title: 'Tour prompt',
        path: '/v/tour-prompt',
        referrer: 'https://mesosphere.com/'
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

    var versions = SidebarStore.get('versions');
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
        {this.getCliInstallModal(showCliModal)}
        {this.getVersionsModal(this.state.showingVersionsModal)}
        {this.getErrorModal(this.state.showErrorModal)}
      </div>
    );
  }
});

module.exports = Modals;
