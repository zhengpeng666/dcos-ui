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

  getInitialState: function() {
    return {
      sortKey: null,
      sortOrder: null
    };
  },

  sortBy: function (comparator) {
    var state = this.state;
    var sortOrder;

    if (state.sortKey == null || state.sortKey === comparator) {
      if (state.sortOrder == null) {
        sortOrder = 1;
      } else if (state.sortOrder === 1) {
        sortOrder = -1;
      } else if (state.sortOrder === -1) {
        sortOrder = null;
        comparator = null;
      }
    }

    this.setState({
      sortKey: comparator,
      sortOrder: sortOrder
    });
  },

  sortHosts: function (hosts) {
    var key = this.state.sortKey;
    var order = this.state.sortOrder;
    var sortfunction;

    if (key === "hostname" || key === "tasks_size") {
      sortfunction = function (a, b) {
        if (a[key] > b[key]) {
          return 1 * order;
        }
        if (a[key] < b[key]) {
          return -1 * order;
        }
        return 0;
      };
    } else if (key === "cpus" || key === "mem" || key === "disk") {
      sortfunction = function (a, b) {
        a = _.last(a.used_resources[key]).percentage;
        b = _.last(b.used_resources[key]).percentage;
        if (a < b) {
          return 1 * order;
        }
        if (a > b) {
          return -1 * order;
        }
        return 0;
      };
    }

    if (sortfunction != null) {
      return _.clone(hosts).sort(sortfunction);
    }

    return hosts;
  },

  getHostItems: function () {
    return _.map(this.sortHosts(this.props.hosts), function (host) {
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
    var sortKey = this.state.sortKey;

    var headerClassSet = React.addons.classSet({
      "dropup": false
    });

    var carets = _.reduce(["hostname", "tasks_size", "cpus", "mem", "disk"],
        function(caret, key) {
      if (key === sortKey) {
        caret[key] = <span className="caret"></span>;
      }
      return caret;
    }, {});

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="grow clickable"
                onClick={this.sortBy.bind(null, "hostname")}>
              <span className={headerClassSet}>
                HOST NAME{carets[sortKey]}
              </span>
            </th>
            <th className="align-right clickable"
                onClick={this.sortBy.bind(null, "tasks_size")}>
              <span className={headerClassSet}>
                TASKS{carets[sortKey]}
              </span>
            </th>
            <th className="align-right clickable"
                onClick={this.sortBy.bind(null, "cpus")}>
              <span className={headerClassSet}>
                CPU{carets[sortKey]}
              </span>
            </th>
            <th className="align-right clickable"
              onClick={this.sortBy.bind(null, "mem")}>
              <span className={headerClassSet}>
                MEM{carets[sortKey]}
              </span>
            </th>
            <th className="align-right clickable"
                onClick={this.sortBy.bind(null, "disk")}>
              <span className={headerClassSet}>
                DISK{carets[sortKey]}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.getHostItems()}
        </tbody>
      </table>
    );
  }
});

module.exports = HostList;
