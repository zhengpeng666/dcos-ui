/** @jsx React.DOM */

var React = require("react/addons");

var Panel = require("./Panel");
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
     var classes = {
      "container container-fluid container-pod": true
    };
    if (this.props.className) {
      classes[this.props.className] = true;
    }

    var classSet = React.addons.classSet(classes);

    return (
      <div className={classSet}>
        <div className="column-small-offset-2 column-small-8 column-medium-offset-3 column-medium-6 column-large-offset-4 column-large-4">
          <Panel ref="panel"
            style={{height: this.state.height}}
            className="vertical-center text-align-center">
            <h2>
              {this.props.title}
            </h2>
            {this.props.children}
          </Panel>
        </div>
      </div>
    );
  }
});

module.exports = AlertPanel;
