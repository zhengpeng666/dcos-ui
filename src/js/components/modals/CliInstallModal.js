/** @jsx React.DOM */

var browserInfo = require("browser-info");
var React = require("react");

var Modal = require("../../components/Modal");

var CliInstructionsModal = React.createClass({

  displayName: "CliInstructionsModal",

  propTypes: {
    onClose: React.PropTypes.func.isRequired,
    additionalContent: React.PropTypes.element
  },

  onClose: function () {
    this.props.onClose();
  },

  getSubHeader: function () {
    return (
      <p className="text-align-center inverse">
        {"Nam quid possumus facere melius? Haec quo modo conveniant, non sane intellego. An est aliquid, quod te sua sponte delectet? Duo Reges: constructio interrete. Egone quaeris, inquit, quid sentiam? Haec bene dicuntur, nec ego repugno, sed inter sese ipsa pugnant."}
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
        </ul>
      );
      cliSnippet = ".\install-dcos-windows.ps1 <install_dir> " + hostname + "";
    } else {
      requirements = (
        <ul>
          <li>A command-line environment, such as Terminal.</li>
          {pythonInstructions}
          {gitInstructions}
        </ul>
      );
      cliSnippet = "mkdir dcos && \\\n cd dcos && \\\n curl -s https://raw.githubusercontent.com/mesosphere/install-scripts/master/dcos-cli/install-dcos-cli-ea2.sh \\\n | bash -s -- . " + hostname + " && \\\n source ./bin/env-setup";
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
      <Modal titleText="Install Mesosphere DCOS CLI"
          subHeader={this.getSubHeader()}
          showCloseButton={false}
          showFooter={false}
          onClose={this.onClose}>
        {this.getContent()}
      </Modal>
    );
  }
});

module.exports = CliInstructionsModal;
