var _ = require('underscore');
var classNames = require('classnames');
var GeminiScrollbar = require('react-gemini-scrollbar');
var Link = require('react-router').Link;
var React = require('react');
var State = require('react-router').State;

import ClusterHeader from './ClusterHeader';
var EventTypes = require('../constants/EventTypes');
import PluginSDK from 'PluginSDK';

var InternalStorageMixin = require('../mixins/InternalStorageMixin');
var MesosSummaryStore = require('../stores/MesosSummaryStore');
var MetadataStore = require('../stores/MetadataStore');
var SidebarActions = PluginSDK.getActions('SidebarActions');
var TooltipMixin = require('../mixins/TooltipMixin');

let defaultMenuItems = ['dashboard', 'services', 'nodes-list', 'network', 'universe', 'settings'];

let {Hooks} = PluginSDK;

var Sidebar = React.createClass({

  displayName: 'Sidebar',

  mixins: [State, InternalStorageMixin, TooltipMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  componentWillMount() {
    this.store_listeners = [{
      name: 'intercom',
      events: [
        'change'
      ]
    }];
  },

  componentDidMount: function () {
    this.internalStorage_update({
      mesosInfo: MesosSummaryStore.get('states').lastSuccessful()
    });

    MetadataStore.addChangeListener(
      EventTypes.DCOS_METADATA_CHANGE,
      this.onDCOSMetadataChange
    );
  },

  componentWillUnmount: function () {
    MetadataStore.removeChangeListener(
      EventTypes.DCOS_METADATA_CHANGE,
      this.onDCOSMetadataChange
    );
  },

  onDCOSMetadataChange: function () {
    this.forceUpdate();
  },

  handleStartTour: function () {
    SidebarActions.close();
    SidebarActions.startTour();
  },

  handleVersionClick: function () {
    SidebarActions.close();
    SidebarActions.showVersions();
  },

  getMenuItems: function () {
    let currentPath = this.context.router.getLocation().getCurrentPath();

    const menuItems = Hooks.applyFilter(
      'sidebarNavigation',
      defaultMenuItems
    );

    return _.map(menuItems, function (routeKey) {
      var route = this.context.router.namedRoutes[routeKey];

      // Figure out if current route is active
      var isActive = route.handler.routeConfig.matches.test(currentPath);
      var iconClasses = {
        'sidebar-menu-item-icon icon icon-sprite icon-sprite-medium': true,
        'icon-sprite-medium-color': isActive,
        'icon-sprite-medium-black': !isActive
      };

      iconClasses[`icon-${route.handler.routeConfig.icon}`] = true;

      var itemClassSet = classNames({
        'sidebar-menu-item': true,
        'selected': isActive
      });

      return (
        <li className={itemClassSet} key={route.name}>
          <Link to={route.name}>
            <i className={classNames(iconClasses)}></i>
            <span className="sidebar-menu-item-label h4 flush">
              {route.handler.routeConfig.label}
            </span>
          </Link>
        </li>
      );

    }, this);
  },

  getVersion() {
    let data = MetadataStore.get('dcosMetadata');
    if (data == null || data.version == null) {
      return null;
    }

    return (
      <span className="version-number">v.{data.version}</span>
    );
  },

  getFooter() {
    let defaultButtonSet = [
      (
        <a key="button-docs" className="button button-link"
          href="http://docs.mesosphere.com/"
          target="_blank"
          data-behavior="show-tip"
          data-tip-place="top-right"
          data-tip-content="Documentation">
            <i className="icon icon-sprite icon-documents icon-sprite-medium clickable"></i>
        </a>
      ),
      (
        <a key="button-tour" className="button button-link"
          data-behavior="show-tip"
          data-tip-place="top-left"
          data-tip-content="Install CLI and Take Tour"
          onClick={this.handleStartTour}>
            <i className="icon icon-sprite icon-tour icon-sprite-medium clickable"></i>
        </a>
      )
    ];

    let buttonSet = Hooks.applyFilter(
      'sidebarFooterButtonSet', defaultButtonSet
    );
    let footer = null;

    if (buttonSet && buttonSet.length) {
      footer = <div className="icon-buttons">{buttonSet}</div>;
    }

    return Hooks.applyFilter('sidebarFooter', footer, defaultButtonSet);
  },

  render: function () {
    return (
      <div className="sidebar flex-container-col">
        <div className="sidebar-header">
          <ClusterHeader />
        </div>
        <GeminiScrollbar autoshow={true} className="sidebar-content container-scrollable">
          <nav>
            <div className="container container-fluid container-fluid-narrow">
              <ul className="sidebar-menu list-unstyled">
                {this.getMenuItems()}
              </ul>
            </div>
          </nav>
        </GeminiScrollbar>
        <div className="sidebar-footer">
          <div className="container container-fluid container-pod container-pod-short logo-container">
            <div className="sidebar-footer-image" />
            <p className="text-align-center flush-top flush-bottom mute small">
              <span className="clickable" onClick={this.handleVersionClick}>
                <span className="company-name small">Mesosphere </span>
                <span className="app-name small">DCOS {this.getVersion()}</span>
              </span>
            </p>
          </div>
          {this.getFooter()}
        </div>
      </div>
    );
  }

});

module.exports = Sidebar;
