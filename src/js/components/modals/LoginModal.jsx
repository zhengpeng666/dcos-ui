/** @jsx React.DOM */

var React = require("react");

var Actions = require("../../actions/Actions");
var InternalStorageMixin = require("../../mixins/InternalStorageMixin");
var Modal = require("../../components/Modal");
var Validator = require("../../utils/Validator");

var LoginModal = React.createClass({

  displayName: "LoginModal",

  mixins: [InternalStorageMixin],

  getInitialState: function () {
    return {
      email: ""
    };
  },

  componentWillMount: function () {
    this.internalStorage_set({
      show: false,
      emailHasError: false
    });

    Actions.getIdentitiy(function (identity) {
      // dismiss or show modal dependent on identity
      var show = identity == null;
      this.internalStorage_update({show: show});
      this.forceUpdate();
    }.bind(this));
  },

  handleEmailChange: function (event) {
    event.preventDefault();
    this.setState({email: event.target.value});
  },

  handleIdentify: function (email) {
    email = email.toLowerCase();
    if (!Validator.isEmail(email)) {
      this.internalStorage_update({emailHasError: true});
      this.forceUpdate();

      return;
    }

    Actions.identify({email: email}, function () {
      // dismiss modal
      this.internalStorage_update({show: false});
      this.forceUpdate();
    }.bind(this));
  },

  renderModalFooter: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="button-collection button-collection-align-horizontal-center flush-bottom">
        <button className="button button-primary button-large button-wide-below-screen-mini"
            onClick={this.handleIdentify.bind(null, this.state.email)}>
          Try Mesosphere DCOS
        </button>
      </div>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  renderSubHeader: function () {
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
          renderSubHeader={this.renderSubHeader}
          renderFooter={this.renderModalFooter}
          show={data.show}
          showCloseButton={false}>
        <form className="flush-bottom"
            onSubmit={this.handleIdentify.bind(null, this.state.email)}>
          <div className={emailClassSet}>
            <input className="form-control flush-bottom"
              type="email"
              onChange={this.handleEmailChange}
              placeholder="Email address"
              value={this.state.email} />
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
