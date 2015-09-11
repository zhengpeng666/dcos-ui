var _ = require("underscore");
var classNames = require("classnames");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var AnimatedLogo = require("../components/AnimatedLogo");
var Actions = require("../actions/Actions");
var EventTypes = require("../constants/EventTypes");
import HistoryStore from "../stores/HistoryStore";
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var IntercomStore = require("../stores/IntercomStore");
var LocalStorageUtil = require("../utils/LocalStorageUtil");
var MesosSummaryStore = require("../stores/MesosSummaryStore");
var Modals = require("../components/Modals");
var RequestErrorMsg = require("../components/RequestErrorMsg");
var Sidebar = require("../components/Sidebar");
var SidebarActions = require("../events/SidebarActions");
var SidebarStore = require("../stores/SidebarStore");

function getMesosState() {
  return {
    statesProcessed: MesosSummaryStore.get("statesProcessed")
  };
}

function getSidebarState() {
  return {
    isOpen: SidebarStore.get("isOpen")
  };
}

var Index = React.createClass({

  displayName: "Index",

  mixins: [InternalStorageMixin],

  getInitialState: function () {
    return {
      showIntercom: IntercomStore.get("isOpen"),
      mesosSummaryErrorCount: 0,
      showErrorModal: false,
      modalErrorMsg: ""
    };
  },

  componentWillMount: function () {
    HistoryStore.init();
    MesosSummaryStore.init();
    SidebarStore.init();
    this.internalStorage_set(getSidebarState());

    var email = LocalStorageUtil.get("email");
    if (email != null) {
      Actions.identify(email, function () {
        IntercomStore.init();
      });
    }
  },

  componentDidMount: function () {
    SidebarStore.addChangeListener(
      EventTypes.SIDEBAR_CHANGE, this.onSideBarChange
    );
    window.addEventListener("resize", SidebarActions.close);

    IntercomStore.addChangeListener(
      EventTypes.INTERCOM_CHANGE, this.handleIntercomChange
    );

    this.addMesosStateListeners();
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) &&
        _.isEqual(this.state, nextState));
  },

  addMesosStateListeners: function () {
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_REQUEST_ERROR, this.onMesosSummaryError
    );
  },

  removeMesosStateListeners: function () {
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_REQUEST_ERROR, this.onMesosSummaryError
    );
  },

  componentWillUnmount: function () {
    SidebarStore.removeChangeListener(
      EventTypes.SIDEBAR_CHANGE, this.onSideBarChange
    );
    window.removeEventListener("resize", SidebarActions.close);

    IntercomStore.removeChangeListener(
      EventTypes.INTERCOM_CHANGE, this.handleIntercomChange
    );

    this.removeMesosStateListeners();

    MesosSummaryStore.unmount();
  },

  onSideBarChange: function () {
    this.internalStorage_update(getSidebarState());
    this.forceUpdate();
  },

  handleIntercomChange: function () {
    var intercom = global.Intercom;
    if (intercom != null) {
      this.setState({showIntercom: IntercomStore.get("isOpen")});
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

    var loadingClassSet = classNames({
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

    var classSet = classNames({
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
        <Modals
          showErrorModal={this.state.showErrorModal}
          modalErrorMsg={this.state.modalErrorMsg} />
      </div>
    );
  }
});

module.exports = Index;
