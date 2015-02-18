/** @jsx React.DOM */

var React = require("react");

var roundPercentage = function (value, decimalPlaces) {
  var factor = Math.pow(10, decimalPlaces);
  return Math.round(value * 100 * factor) / factor;
};

var ServiceItem = React.createClass({

  displayName: "ServiceItem",

  propTypes: {
    model: React.PropTypes.object.isRequired,
    totalResources: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      model: {},
      totalResources: {cpus: 0, mem: 0, disk: 0}
    };
  },

  getStatus: function () {
    var model = this.props.model;

    var status = "Active";
    if (model.active !== true) {
      status = "Inactive";
    }

    var statusClassSet = React.addons.classSet({
      "text-success": model.active,
      "text-danger": !model.active
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <p className={statusClassSet}>{status} ({model.tasks.length} Tasks)</p>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getStatistics: function () {
    var resources = this.props.model.resources;
    var totalResources = this.props.totalResources;

    var cpus = roundPercentage(resources.cpus / totalResources.cpus, 2);
    var mem = roundPercentage(resources.mem / totalResources.mem, 2);
    var disk = roundPercentage(resources.disk / totalResources.disk, 2);

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <ul>
        <li><span>{cpus}%</span> CPU</li>
        <li><span>{mem}%</span> Mem</li>
        <li><span>{disk}%</span> Disk</li>
      </ul>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  render: function () {
    var model = this.props.model;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <tr title={model.id}>
        <td width="1">
          {/* That is a dummy icon, please replace. */}
          <div
            style={{
              "backgroundColor": "#000",
              "backgroundImage": "url('http://placekitten.com/g/32/32')",
              width: "32px",
              height: "32px",
              "borderRadius": "5px"}}>
          </div>
        </td>
        <td>
          <p>{model.name}</p>
          {this.getStatus()}
        </td>
        <td>
          {this.getStatistics()}
        </td>
      </tr>
    );
  }
});

module.exports = ServiceItem;
