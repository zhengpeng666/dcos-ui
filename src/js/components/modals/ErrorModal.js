var React = require("react");

import {Modal} from "reactjs-components";

var ErrorModal = React.createClass({

  displayName: "ErrorModal",

  propTypes: {
    onClose: React.PropTypes.func.isRequired,
    errorMsg: React.PropTypes.element
  },

  onClose: function () {
    this.props.onClose();
  },

  render: function () {
    return (
      <Modal titleText="Looks Like Something is Wrong"
        modalClass="modal"
        titleClass="modal-header-title text-align-center flush-top inverse"
        subHeader=""
        showCloseButton={false}
        showFooter={false}
        onClose={this.onClose}
        open={this.props.open}>
        {this.props.errorMsg}
      </Modal>
    );
  }
});

module.exports = ErrorModal;
