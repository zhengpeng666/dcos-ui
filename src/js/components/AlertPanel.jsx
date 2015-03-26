/** @jsx React.DOM */

var React = require("react/addons");

var Panel = require("./Panel.jsx");
var DOMUtils = require("../utils/DOMUtils");

var AlertPanel = React.createClass({

  displayName: "AlertPanel",

  propTypes: {
    title: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      height: 0
    };
  },

  componentDidMount: function () {
    var panel = this.refs.panel.getDOMNode();
    var width = DOMUtils.getComputedWidth(panel);
    this.setState({height: width});
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <div className="container container-fluid container-pod">
        <div className="column-small-offset-2 column-small-8 column-medium-offset-3 column-medium-6 column-large-offset-4 column-large-4">
          <Panel ref="panel"
            style={{height: this.state.height}}
            className="vertical-center text-align-center">
            <h2>
              {this.props.title}
            </h2>
            <p>
              {this.props.children}
            </p>
          </Panel>
        </div>
      </div>
    );
  }
});

module.exports = AlertPanel;
