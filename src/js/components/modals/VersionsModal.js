var React = require("react");

var Modal = require("../../components/Modal");

var VersionsModal = React.createClass({

  displayName: "VersionsModal",

  propTypes: {
    onClose: React.PropTypes.func.isRequired,
    versionDump: React.PropTypes.object.isRequired
  },

  onClose: function () {
    this.props.onClose();
  },

  getContent: function () {
    var string = JSON.stringify(this.props.versionDump, null, 2);
    return (<pre>{string}</pre>);
  },

  render: function () {
    return (
      <Modal titleText="DCOS Info"
          showCloseButton={false}
          showFooter={false}
          size="large"
          onClose={this.onClose}>
        {this.getContent()}
      </Modal>
    );
  }
});

module.exports = VersionsModal;
