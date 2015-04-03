/** @jsx React.DOM */

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var Actions = require("../actions/Actions");
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
      identityUpdated: false
    };
  },

  componentWillMount: function () {
    this.internalStorage_set(getSidebarState());
    MesosStateStore.init();

    Actions.getIdentitiy(function (identity) {
      // dismiss or show modal dependent on identity
      this.setState({
        hasIdentity: identity != null && !!identity.email,
        identityUpdated: true
      });
    }.bind(this));
  },

  componentDidMount: function () {
    SidebarStore.addChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onSideBarChange
    );
    window.addEventListener("resize", SidebarActions.close);

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );
  },

  componentWillUnmount: function () {
    SidebarStore.removeChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onSideBarChange
    );
    window.removeEventListener("resize", SidebarActions.close);

    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );
  },

  onSideBarChange: function () {
    this.internalStorage_set(getSidebarState());
    this.forceUpdate();
  },

  onMesosStateChange: function () {
    var state = getMesosState();
    // if state is processed, stop listening
    if (state.statesProcessed) {
      MesosStateStore.removeChangeListener(
        EventTypes.MESOS_STATE_CHANGE,
        this.onMesosStateChange
      );
    }

    this.internalStorage_update(state);
    this.forceUpdate();
  },

  onLogin: function (email) {
    Actions.identify({email: email}, function () {
      this.setState({hasIdentity: true});
    }.bind(this));
  },

  getLoadingScreen: function (isReady) {
    if (isReady) {
      return;
    }

    return (
      <div className="text-align-center vertical-center">
        <div className="ball-scale">
          <div />
        </div>
        <h4>Loading...</h4>
      </div>
    );
  },

  getLoginModal: function (isReady, hasIdentity) {
    if (!isReady || hasIdentity) {
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
    var isReady = data.statesProcessed && this.state.identityUpdated;

    var classSet = React.addons.classSet({
      "canvas-sidebar-open": data.isOpen
    });

    return (
      <div id="canvas" className={classSet}>
        {this.getLoadingScreen(isReady)}
        {this.getLoginModal(isReady, this.state.hasIdentity)}
        <Sidebar />
        <RouteHandler />
      </div>
    );
  }
});

module.exports = Index;
