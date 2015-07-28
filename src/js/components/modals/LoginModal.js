var classNames = require("classnames");
var React = require("react");

var InternalStorageMixin = require("../../mixins/InternalStorageMixin");
var Modal = require("../../components/Modal");
var Validator = require("../../utils/Validator");

var LoginModal = React.createClass({

  displayName: "LoginModal",

  propTypes: {
    onLogin: React.PropTypes.func.isRequired
  },

  mixins: [InternalStorageMixin],

  getInitialState: function () {
    return {
      closing: false
    };
  },

  componentWillMount: function () {
    this.internalStorage_set({
      emailHasError: false,
      email: ""
    });
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var email = this.refs.email.getDOMNode().value.toLowerCase();

    if (!Validator.isEmail(email)) {
      this.internalStorage_update({
        emailHasError: true,
        email: email
      });

      this.forceUpdate();

      return;
    }

    this.internalStorage_update({email: email});
    this.setState({closing: true});
  },

  onClose: function () {
    this.props.onLogin(this.internalStorage_get().email);
  },

  getFooter: function () {
    return (
      <div className="button-collection button-collection-align-horizontal-center flush-bottom">
        <button className="button button-primary button-large button-wide-below-screen-mini"
            onClick={this.handleSubmit}>
          Try Mesosphere DCOS
        </button>
      </div>
    );
  },

  getSubHeader: function () {
    return (
      <p className="text-align-center inverse">
        Your feedback means a lot to us. Please provide an email address below
        that we can use to respond to your comments and suggestions.
      </p>
    );
  },

  render: function () {
    var data = this.internalStorage_get();

    var emailClassSet = classNames({
      "form-group": true,
      "flush-bottom": true,
      "form-group-error": data.emailHasError
    });

    var emailHelpBlock = classNames({
      "form-help-block": true,
      "hidden": !data.emailHasError
    });

    return (
      <Modal closeByBackdropClick={false}
          titleText="Mesosphere DCOS"
          subHeader={this.getSubHeader()}
          footer={this.getFooter(data.email)}
          showCloseButton={false}
          shouldClose={this.state.closing}
          onClose={this.onClose}
          open={this.props.open}>
        <form className="flush-bottom"
            onSubmit={this.handleSubmit}>
          <div className={emailClassSet}>
            <input className="form-control flush-bottom"
              type="email"
              placeholder="Email address"
              ref="email" />
            <p className={emailHelpBlock}>
              Please provide a valid email address (e.g. email@domain.com).
            </p>
          </div>
        </form>
      </Modal>
    );
  }
});

module.exports = LoginModal;
