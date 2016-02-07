import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactZeroClipboard from 'react-zeroclipboard';
// ReactZeroClipboard injects ZeroClipboard from a third-party server unless
// global.ZeroClipboard is already defined:
import ZeroClipboard from 'zeroclipboard';
global.ZeroClipboard = ZeroClipboard;

import Actions from '../actions/Actions';
import ClusterName from './ClusterName';
import DCOSLogo from './DCOSLogo';
import MetadataStore from '../stores/MetadataStore';
import TooltipMixin from '../mixins/TooltipMixin';

var ClusterHeader = React.createClass({
  displayName: 'ClusterHeader',

  mixins: [TooltipMixin],

  getDefaultProps: function () {
    return {
      useClipboard: true
    };
  },

  handleCopy() {
    this.tip_updateTipContent(
      ReactDOM.findDOMNode(this.refs.copyButton), 'Copied!'
    );
    Actions.log({eventID: 'Copied hostname from sidebar'});
  },

  handleMouseOverCopyIcon() {
    var el = ReactDOM.findDOMNode(this.refs.copyButton);
    this.tip_showTip(el);
  },

  handleMouseOutCopyIcon() {
    this.tip_hideTip(ReactDOM.findDOMNode(this.refs.copyButton));
  },

  getFlashButton(content) {
    let clipboard = null;
    var hasFlash = false;

    try {
      hasFlash = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
    } catch(exception) {
      hasFlash = navigator.mimeTypes['application/x-shockwave-flash'] != null;
    }

    if (this.props.useClipboard) {
      clipboard = (
        <ReactZeroClipboard
          text={content}
          onAfterCopy={this.handleCopy}>
          <i className="icon icon-sprite icon-sprite-mini icon-clipboard icon-sprite-mini-color clickable" />
        </ReactZeroClipboard>
      );
    }

    if (hasFlash) {
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

  getHostName(metadata) {
    if (!_.isObject(metadata) ||
      metadata.PUBLIC_IPV4 == null ||
      metadata.PUBLIC_IPV4.length === 0) {
      return null;
    }

    return (
      <div className="sidebar-header-sublabel"
        title={metadata.PUBLIC_IPV4}>
        <span className="hostname text-overflow">
          {metadata.PUBLIC_IPV4}
        </span>
        <span className="sidebar-header-sublabel-action">
          {this.getFlashButton(metadata.PUBLIC_IPV4)}
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
        {this.getHostName(MetadataStore.get('metadata'))}
      </div>
    );
  }
});

module.exports = ClusterHeader;
