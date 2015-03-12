/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var ServiceItem = require("./ServiceItem");

var ServicesList = React.createClass({

  displayName: "ServicesList",

  propTypes: {
    frameworks: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      frameworks: []
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

    if (state.sortKey !== comparator) {
      sortOrder = 1;
    }

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

  sortServices: function (frameworks) {
    var key = this.state.sortKey;
    var order = this.state.sortOrder;
    var sortfunction = function (a, b) {
      if (a[key] > b[key]) {
        return 1 * order;
      }
      if (a[key] < b[key]) {
        return -1 * order;
      }
      return 0;
    };

    if (key === "cpus" || key === "mem" || key === "disk") {
      sortfunction = function (a, b) {
        a = _.last(a.used_resources[key]).value;
        b = _.last(b.used_resources[key]).value;
        if (a > b) {
          return 1 * order;
        }
        if (a < b) {
          return -1 * order;
        }
        return 0;
      };
    }

    if (sortfunction != null) {
      return _.clone(frameworks).sort(sortfunction);
    }

    return frameworks;
  },

  getServiceItems: function (highlighted) {
    return _.map(this.sortServices(this.props.frameworks), function (service) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <ServiceItem
            key={service.id}
            model={service}
            columnHighlighted={highlighted} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    var sortKey = this.state.sortKey;
    var highlighted = [];

    var headerClassSet = React.addons.classSet({
      "dropup": this.state.sortOrder === -1
    });

    var carets = _.reduce(["name", "active", "tasks_size", "cpus", "mem", "disk"],
        function(caret, key, i) {
      if (key === sortKey) {
        caret[key] = <span className="caret"></span>;
        highlighted[i] = " highlighted";
      } else {
        highlighted[i] = "";
      }
      return caret;
    }, {});

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <table className="table">
        <thead>
          <tr>
            <th className={"clickable" + highlighted[0]}
                onClick={this.sortBy.bind(null, "name")}>
              <span className={headerClassSet}>
                SERVICE NAME{carets.name}
              </span>
            </th>
            <th className={"clickable" + highlighted[1]}
                onClick={this.sortBy.bind(null, "active")}>
              <span className={headerClassSet}>
                HEALTH{carets.active}
              </span>
            </th>
            <th className={"align-right clickable" + highlighted[2]}
                onClick={this.sortBy.bind(null, "tasks_size")}>
              <span className={headerClassSet}>
                TASKS{carets.tasks_size}
              </span>
            </th>
            <th className={"align-right fixed-width clickable" + highlighted[3]}
                onClick={this.sortBy.bind(null, "cpus")}>
              <span className={headerClassSet}>
                CPU{carets.cpus}
              </span>
            </th>
            <th className={"align-right fixed-width clickable" + highlighted[4]}
                onClick={this.sortBy.bind(null, "mem")}>
              <span className={headerClassSet}>
                MEM{carets.mem}
              </span>
            </th>
            <th className={"align-right fixed-width clickable" + highlighted[5]}
                onClick={this.sortBy.bind(null, "disk")}>
              <span className={headerClassSet}>
                DISK{carets.disk}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.getServiceItems(highlighted)}
        </tbody>
      </table>
    );
  }
});

module.exports = ServicesList;
