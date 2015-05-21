/** @jsx React.DOM */

var browserInfo = require("browser-info");
var React = require("react");

var Modal = require("../../components/Modal");

var CliInstructionsModal = React.createClass({

  displayName: "CliInstructionsModal",

  propTypes: {
    title: React.PropTypes.string.isRequired,
    subHeaderContent: React.PropTypes.string,
    showFooter: React.PropTypes.bool.isRequired,
    footer: React.PropTypes.node,
    onClose: React.PropTypes.func.isRequired,
    additionalContent: React.PropTypes.element
  },

  onClose: function () {
    this.props.onClose();
  },

  getSubHeader: function () {
    if (!this.props.subHeaderContent) {
      return false;
    }

    return (
      <p className="text-align-center inverse flush-bottom">
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
    var installRequirements = (
      <li>
      Install the following <a href="https://virtualenv.pypa.io/en/latest/installation.html" target="_blank">virtualenv</a>, <a href="http://git-scm.com/" target="_blank">git</a>, and <a href="http://stedolan.github.io/jq/download/" target="_blank">jq</a>.
      </li>
    );

    if (OS === "Windows") {
      requirements = (
        <ul>
          <li>
            A command-line environment, such as Terminal or Windows Powershell.
          </li>
          {pythonInstructions}
          {installRequirements}
          <li>
            Download: <a href="https://downloads.mesosphere.io/dcos-cli/install.ps1" target="_blank">install-dcos-windows.ps1</a>
          </li>
        </ul>
      );
      cliSnippet = ".\\install-dcos-windows.ps1 . http://" + hostname;
    } else {
      requirements = (
        <ul>
          <li>A command-line environment, such as Terminal.</li>
          {pythonInstructions}
          {installRequirements}
        </ul>
      );
      cliSnippet = "mkdir -p dcos && cd dcos && \\\n  curl -O https://downloads.mesosphere.io/dcos-cli/install.sh && \\\n  bash ./install.sh . http://" + hostname + " && \\\n  source ./bin/env-setup";
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
        <h4 className="flush-top">Prerequisites:</h4>
        {instructions.requirements}
        <h4 className="snippet-description">To install the CLI, copy and paste into your terminal:</h4>
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
