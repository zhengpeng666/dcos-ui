import _ from 'underscore';
import Clipboard from 'clipboard';
import browserInfo from 'browser-info';
import React from 'react';
import ReactDOM from 'react-dom';

import ClusterName from './ClusterName';
import DCOSLogo from './DCOSLogo';
import MetadataStore from '../stores/MetadataStore';
import {Hooks} from 'PluginSDK';
import TooltipMixin from '../mixins/TooltipMixin';

var ClusterHeader = React.createClass({
  displayName: 'ClusterHeader',

  mixins: [TooltipMixin],

  getDefaultProps: function () {
    return {
      useClipboard: true
    };
  },

  componentDidMount() {
    if (this.refs.copyButton) {
      this.clipboard = new Clipboard(this.refs.copyButton, {
        text: () => {
          return this.getPublicIP();
        }
      });
      this.clipboard.on('success', this.handleCopy);
    }
  },

  componentWillUnmount() {
    this.clipboard.destroy();
  },

  handleCopy() {
    this.tip_updateTipContent(
      ReactDOM.findDOMNode(this.refs.copyButton), 'Copied!'
    );
    Hooks.doAction('log', {eventID: 'Copied hostname from sidebar'});
  },

  handleMouseOverCopyIcon() {
    var el = ReactDOM.findDOMNode(this.refs.copyButton);
    this.tip_showTip(el);
  },

  handleMouseOutCopyIcon() {
    this.tip_hideTip(ReactDOM.findDOMNode(this.refs.copyButton));
  },

  getFlashButton() {
    let clipboard = null;

    if (this.props.useClipboard) {
      clipboard = (
        <i className="icon icon-sprite icon-sprite-mini icon-clipboard icon-sprite-mini-color clickable" />
      );
    }

    if (!/safari/i.test(browserInfo().name)) {
      return (
        <div data-behavior="show-tip"
          data-tip-place="bottom"
          data-tip-content="Copy to clipboard"
          onMouseOver={this.handleMouseOverCopyIcon}
          onMouseOut={this.handleMouseOutCopyIcon}
          ref="copyButton">
          {clipboard}
        </div>
      );
    }

    return null;
  },

  getPublicIP() {
    let metadata = MetadataStore.get('metadata');

    if (!_.isObject(metadata) ||
      metadata.PUBLIC_IPV4 == null ||
      metadata.PUBLIC_IPV4.length === 0) {
      return null;
    }

    return metadata.PUBLIC_IPV4;
  },

  getHostName() {
    let ip = this.getPublicIP();

    return (
      <div className="sidebar-header-sublabel"
        title={ip}>
        <span className="hostname text-overflow">
          {ip}
        </span>
        <span className="sidebar-header-sublabel-action">
          {this.getFlashButton()}
        </span>
      </div>
    );
  },

  render() {
    return (
      <div className="container container-fluid container-fluid-narrow container-pod container-pod-short">
        <div className="sidebar-header-image">
          <DCOSLogo />
        </div>
        <ClusterName />
        {this.getHostName()}
      </div>
    );
  }
});

module.exports = ClusterHeader;
