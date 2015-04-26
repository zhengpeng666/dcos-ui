/** @jsx React.DOM */

var browserInfo = require("browser-info");
var React = require("react");

var Modal = require("../../components/Modal");

var CliInstructionsModal = React.createClass({

  displayName: "CliInstructionsModal",

  propTypes: {
    title: React.PropTypes.string.isRequired,
    subHeaderContent: React.PropTypes.string.isRequired,
    showFooter: React.PropTypes.bool.isRequired,
    footer: React.PropTypes.node,
    onClose: React.PropTypes.func.isRequired,
    additionalContent: React.PropTypes.element
  },

  onClose: function () {
    this.props.onClose();
  },

  getSubHeader: function () {
    return (
      <p className="text-align-center inverse">
        {this.props.subHeaderContent}
      </p>
    );
  },

  getCliInstructions: function () {
    var hostname = window.location.hostname;
    var OS = browserInfo().os;
    var requirements = "";
    var cliSnippet = "";

    var pythonInstructions = (
      <li>
        Python 2.7.9 or 3.4 or later, which includes the 'pip' package installer.
      </li>
    );
    var gitInstructions = (
      <li>
      The <a href="http://git-scm.com/" target="_blank">git</a> version control application.
      </li>
    );

    if (OS === "Windows") {
      requirements = (
        <ul>
          <li>
            A command-line environment, such as Terminal or Windows Powershell.
          </li>
          {pythonInstructions}
          {gitInstructions}
          <li>
            Download: <a href="https://raw.githubusercontent.com/mesosphere/install-scripts/master/dcos-cli/install-dcos-windows.ps1" target="_blank">install-dcos-windows.ps1</a>
          </li>
        </ul>
      );
      cliSnippet = ".\\install-dcos-windows.ps1 . " + hostname + "";
    } else {
      requirements = (
        <ul>
          <li>A command-line environment, such as Terminal.</li>
          {pythonInstructions}
          {gitInstructions}
        </ul>
      );
      cliSnippet = "mkdir dcos && cd dcos\ncurl -O https://downloads.mesosphere.io/dcos-cli/install.sh\nsh ./install.sh . " + hostname + "\nsource ./bin/env-setup && dcos package update";
    }

    return {
      requirements: requirements,
      cliSnippet: cliSnippet
    };
  },

  getContent: function () {
    var instructions = this.getCliInstructions();
    return (
      <div className="install-cli-modal-content">
        <h4 className="flush-top">You will need:</h4>
        {instructions.requirements}
        <h4 className="snippet-description">Copy and paste into your terminal:</h4>
        <div className="flush-top snippet-wrapper">
          <pre className="mute prettyprint flush-bottom prettyprinted">{instructions.cliSnippet}</pre>
        </div>
      </div>
    );
  },

  render: function () {
    return (
      <Modal titleText={this.props.title}
          subHeader={this.getSubHeader()}
          showCloseButton={false}
          showFooter={this.props.showFooter}
          onClose={this.onClose}
          footer={this.props.footer}>
        {this.getContent()}
      </Modal>
    );
  }
});

module.exports = CliInstructionsModal;
