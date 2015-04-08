/** @jsx React.DOM */

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var Actions = require("../actions/Actions");
var LocalStorageUtil = require("../utils/LocalStorageUtil");
var EventTypes = require("../constants/EventTypes");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MesosStateStore = require("../stores/MesosStateStore");
var LoginModal = require("../components/modals/LoginModal");
var Sidebar = require("../components/Sidebar");
var SidebarActions = require("../events/SidebarActions");
var SidebarStore = require("../stores/SidebarStore");

function getMesosState() {
  return {
    statesProcessed: MesosStateStore.getStatesProcessed()
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
      mesosStateErrorCount: 0
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
      EventTypes.SIDEBAR_CHANGE,
      this.onSideBarChange
    );
    window.addEventListener("resize", SidebarActions.close);

    this.addMesosStateListeners();
  },

  addMesosStateListeners: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateError
    );
  },

  removeMesosStateListeners: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateError
    );
  },

  componentWillUnmount: function () {
    SidebarStore.removeChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onSideBarChange
    );
    window.removeEventListener("resize", SidebarActions.close);

    this.removeMesosStateListeners();
  },

  onSideBarChange: function () {
    this.internalStorage_set(getSidebarState());
    this.forceUpdate();
  },

  onMesosStateChange: function () {
    var state = getMesosState();
    // if state is processed, stop listening
    if (state.statesProcessed) {
      this.removeMesosStateListeners();
    }

    this.internalStorage_update(state);
    this.setState({mesosStateErrorCount: 0});
  },

  onMesosStateError: function () {
    this.setState({mesosStateErrorCount: ++this.state.mesosStateErrorCount});
  },

  onLogin: function (email) {
    LocalStorageUtil.set("email", email);
    Actions.identify({email: email});
    this.setState({hasIdentity: true});
  },

  getErrorMsg: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
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
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getLoadingScreen: function (isReady) {
    if (isReady) {
      return;
    }
    var hasLoadingError = this.state.mesosStateErrorCount >= 3;
    var errorMsg = null;
    if (hasLoadingError) {
      errorMsg = this.getErrorMsg();
    }

    var loadingClassSet = React.addons.classSet({
      "hidden": hasLoadingError
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="container text-align-center vertical-center">
        <div className="row">
          <div className={loadingClassSet}>
            <div className="ball-scale">
              <div />
            </div>
            <h4>Loading...</h4>
          </div>
          {errorMsg}
        </div>
      </div>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getLoginModal: function (hasIdentity) {
    if (hasIdentity) {
      return;
    }

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <LoginModal onLogin={this.onLogin} />
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */

  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    var data = this.internalStorage_get();
    var isReady = data.statesProcessed;

    var classSet = React.addons.classSet({
      "canvas-sidebar-open": data.isOpen
    });

    return (
      <div id="canvas" className={classSet}>
        {this.getLoadingScreen(isReady)}
        {this.getLoginModal(this.state.hasIdentity)}
        <Sidebar />
        <RouteHandler />
      </div>
    );
  }
});

module.exports = Index;
