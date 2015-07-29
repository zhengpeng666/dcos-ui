var React = require("react/addons");

var IntercomActions = require("../events/IntercomActions");

var RequestErrorMsg = React.createClass({

  displayName: "RequestErrorMsg",

  render: function () {
    return (
      <div className="column-small-8 column-small-offset-2 column-medium-6 column-medium-offset-3">
        <h3>
          Cannot Connect With The Server
        </h3>
        <p className="text-align-center">
          {"We have been notified of the issue, but would love to know more. Talk with us using "}
          <a className="clickable" onClick={IntercomActions.open}>Intercom</a>
          {". You can also join us on our "}
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
  }
});

module.exports = RequestErrorMsg;
