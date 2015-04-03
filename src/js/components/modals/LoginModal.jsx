/** @jsx React.DOM */

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
      show: false
    };
  },

  componentWillMount: function () {
    this.internalStorage_set({
      emailHasError: false,
      email: ""
    });
  },

  handleSubmit: function () {
    var email = this.refs.email.getDOMNode().value.toLowerCase();
    if (!Validator.isEmail(email)) {
      this.internalStorage_update({
        emailHasError: true,
        email: email
      });
      this.forceUpdate();

      return;
    }

    this.props.onLogin(email);
  },

  getFooter: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="button-collection button-collection-align-horizontal-center flush-bottom">
        <button className="button button-primary button-large button-wide-below-screen-mini"
            onClick={this.handleSubmit}>
          Try Mesosphere DCOS
        </button>
      </div>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getSubHeader: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <p className="text-align-center inverse">
        Thanks for your participation in the Mesosphere Early Access Program.
        Your feedback means a lot to us. Please provide an email below that
        we can use to respond to your comments and suggestions.
      </p>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  render: function () {
    var data = this.internalStorage_get();

    var emailClassSet = React.addons.classSet({
      "form-group": true,
      "flush-bottom": true,
      "form-group-error": data.emailHasError
    });

    var emailHelpBlock = React.addons.classSet({
      "form-help-block": true,
      "hidden": !data.emailHasError
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Modal titleText="Mesosphere DCOS Early Access"
          subHeader={this.getSubHeader()}
          footer={this.getFooter(data.email)}
          showCloseButton={false}>
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
