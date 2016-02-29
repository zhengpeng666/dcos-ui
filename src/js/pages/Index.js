var _ = require('underscore');
var classNames = require('classnames');
var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var AnimatedLogo = require('../components/AnimatedLogo');
var Config = require('../config/Config');
import ConfigStore from '../stores/ConfigStore';
import EventTypes from '../constants/EventTypes';
import HistoryStore from '../stores/HistoryStore';
var InternalStorageMixin = require('../mixins/InternalStorageMixin');
var IntercomStore = require('../../../plugins/tracking/stores/IntercomStore');
var MetadataStore = require('../stores/MetadataStore');
var MesosSummaryStore = require('../stores/MesosSummaryStore');
var Modals = require('../components/Modals');
import PluginSDK from 'PluginSDK';
var RequestErrorMsg = require('../components/RequestErrorMsg');
import ServerErrorModal from '../components/ServerErrorModal';
var Sidebar = require('../components/Sidebar');
var SidebarActions = PluginSDK.getActions('SidebarActions');
var SidebarStore = require('../stores/SidebarStore');

function getSidebarState() {
  return {
    isOpen: SidebarStore.get('isOpen')
  };
}

var Index = React.createClass({

  displayName: 'Index',

  mixins: [InternalStorageMixin],

  getInitialState: function () {
    return {
      showIntercom: IntercomStore.get('isOpen'),
      mesosSummaryErrorCount: 0,
      showErrorModal: false,
      modalErrorMsg: '',
      configErrorCount: 0
    };
  },

  componentWillMount: function () {
    HistoryStore.init();
    MesosSummaryStore.init();
    MetadataStore.init();
    SidebarStore.init();

    let state = getSidebarState();
    state.metadataLoaded = false;
    this.internalStorage_set(state);
  },

  componentDidMount: function () {
    SidebarStore.addChangeListener(
      EventTypes.SIDEBAR_CHANGE, this.onSideBarChange
    );
    window.addEventListener('resize', SidebarActions.close);

    IntercomStore.addChangeListener(
      EventTypes.INTERCOM_CHANGE, this.handleIntercomChange
    );

    ConfigStore.addChangeListener(
      EventTypes.CONFIG_ERROR, this.onConfigError
    );

    MetadataStore.addChangeListener(
      EventTypes.METADATA_CHANGE, this.onMetadataStoreSuccess
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
    window.removeEventListener('resize', SidebarActions.close);

    IntercomStore.removeChangeListener(
      EventTypes.INTERCOM_CHANGE, this.handleIntercomChange
    );

    ConfigStore.removeChangeListener(
      EventTypes.CONFIG_ERROR, this.onConfigError
    );

    MetadataStore.removeChangeListener(
      EventTypes.METADATA_CHANGE, this.onMetadataStoreSuccess
    );

    this.removeMesosStateListeners();

    MesosSummaryStore.unmount();
  },

  onSideBarChange: function () {
    this.internalStorage_update(getSidebarState());
    this.forceUpdate();
  },

  onMetadataStoreSuccess: function () {
    this.internalStorage_update({'metadataLoaded': true});
  },

  onConfigError: function () {
    this.setState({configErrorCount: this.state.configErrorCount + 1});

    if (this.state.configErrorCount < Config.delayAfterErrorCount) {
      ConfigStore.fetchConfig();
    }
  },

  handleIntercomChange: function () {
    var intercom = global.Intercom;
    if (intercom != null) {
      this.setState({showIntercom: IntercomStore.get('isOpen')});
    } else {
      this.setState({
        showErrorModal: true,
        modalErrorMsg: (
          <p className="text-align-center flush-bottom">
            We are unable to communicate with Intercom.io. It is possible that you have a browser plugin or extension that is blocking communication. If so, please disable it and try again.
          </p>
        )
      });
    }
  },

  onMesosSummaryChange: function () {
    let prevStatesProcessed = this.internalStorage_get().statesProcessed;

    // Reset count as we've just received a successful response
    if (this.state.mesosSummaryErrorCount > 0) {
      this.setState({mesosSummaryErrorCount: 0});
    } else if (!prevStatesProcessed) {
      // This conditional is needed to remove the loading screen after
      // receiving a successful server response. This forceupdate should only
      // run once, otherwise the whole application will update.
      this.forceUpdate();
    }
  },

  onMesosSummaryError: function () {
    this.setState({
      mesosSummaryErrorCount: this.state.mesosSummaryErrorCount + 1
    });
  },

  getLoadingScreen: function (showLoadingScreen) {
    if (!showLoadingScreen) {
      return null;
    }

    return <AnimatedLogo speed={500} scale={0.16} />;
  },

  getErrorScreen: function (showErrorScreen) {
    if (!showErrorScreen) {
      return null;
    }

    return <RequestErrorMsg />;
  },

  getScreenOverlays: function (showLoadingScreen, showErrorScreen) {
    if (!showLoadingScreen && !showErrorScreen) {
      return null;
    }

    return (
      <div className="container container-pod vertical-center">
        {this.getErrorScreen(showErrorScreen)}
        {this.getLoadingScreen(showLoadingScreen)}
      </div>
    );
  },

  renderIntercom: function () {
    var intercom = global.Intercom;
    if (intercom != null) {
      if (this.state.showIntercom) {
        intercom('show');
      } else {
        intercom('hide');
      }
    }
  },

  render: function () {
    var data = this.internalStorage_get();
    let showErrorScreen =
      (this.state.mesosSummaryErrorCount >= Config.delayAfterErrorCount)
      || (this.state.configErrorCount >= Config.delayAfterErrorCount);
    let showLoadingScreen = !showErrorScreen
      && (!MesosSummaryStore.get('statesProcessed') || !data.metadataLoaded);

    var classSet = classNames({
      'canvas-sidebar-open': data.isOpen
    });

    this.renderIntercom();

    return (
      <div>
        <a id="start-tour"></a>
        <div id="canvas" className={classSet}>
          {this.getScreenOverlays(showLoadingScreen, showErrorScreen)}
          <Sidebar />
          <RouteHandler />
        </div>
        <Modals
          showErrorModal={this.state.showErrorModal}
          modalErrorMsg={this.state.modalErrorMsg} />
        <ServerErrorModal />
      </div>
    );
  }
});

module.exports = Index;
