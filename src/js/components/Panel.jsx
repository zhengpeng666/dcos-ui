/** @jsx React.DOM */

var React = require("react/addons");

var Panel = React.createClass({

  displayName: "Panel",

  propTypes: {
    title: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getHeading: function () {
    var title = this.props.title;
    if (title == null || title === "") {
      return null;
    }

    return (
      <div className="panel-heading text-align-center">
        <h3 className="panel-title">
          {title}
        </h3>
      </div>
    );
  },

  getPanelContents: function () {
    return React.Children.map(this.props.children, function (child) {
      return child;
    });
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    var classes = {
      "panel": true
    };
    if (this.props.className) {
      classes[this.props.className] = true;
    }

    var classSet = React.addons.classSet(classes);

    return (
      <div className={classSet} style={this.props.style}>
        {this.getHeading()}
        <div className="panel-content">
          {this.getPanelContents()}
        </div>
      </div>
    );
  }
});

module.exports = Panel;
