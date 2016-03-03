var React = require('react');

import PluginSDK from 'PluginSDK';

var RequestErrorMsg = React.createClass({

  displayName: 'RequestErrorMsg',

  render: function () {
    var Tracking = PluginSDK.getActions('tracking', {
      openIntercom: function () {}
    });
    return (
      <div className="row">
        <div className="column-small-8 column-small-offset-2 column-medium-6 column-medium-offset-3">
          <h3 className="inverse text-align-center flush-top">
            Cannot Connect With The Server
          </h3>
          <p className="inverse text-align-center flush-bottom">
            {'We have been notified of the issue, but would love to know more. Talk with us using '}
            <a className="clickable" onClick={Tracking.openIntercom}>Intercom</a>
            {'. You can also join us on our '}
            <a href="https://mesosphere.slack.com/messages/dcos-eap-public"
                target="_blank">
              Slack channel
            </a> or send us an email at&nbsp;
            <a href="mailto:support@mesosphere.com">
              support@mesosphere.com
            </a>.
          </p>
        </div>
      </div>
    );
  }
});

module.exports = RequestErrorMsg;
