/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var HostItem = require("./HostItem");

var HostList = React.createClass({

  displayName: "HostList",

  propTypes: {
    hosts: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      hosts: []
    };
  },

  getHostItems: function () {
    return _.map(this.props.hosts, function (host) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <HostItem
            key={host.id}
            model={host} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <ul className="collection-list list-unstyled inverse">
        <li className="collection-item collection-header">
          <div className="collection-item-header">
          </div>
          <div className="collection-item-content">
            <ul className="list-unstyled list-inline inverse flush-top flush-bottom">
              <li>
                <span>SERVICE NAME</span>
              </li>
              <li>
                <span>TASKS</span>
              </li>
            </ul>
          </div>
          <div className="collection-item-footer">
            <ul className="list-unstyled list-inline inverse flush-top flush-bottom">
              <li><span>CPU</span></li>
              <li><span>MEM</span></li>
              <li><span>DISK</span></li>
            </ul>
          </div>
        </li>
        {this.getHostItems()}
      </ul>
    );
  }
});

module.exports = HostList;
