var classNames = require("classnames");
var React = require("react");

var FilterHeadline = React.createClass({

  displayName: "FilterHeadline",

  propTypes: {
    onReset: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    currentLength: React.PropTypes.number.isRequired,
    totalLength: React.PropTypes.number.isRequired
  },

  handleReset: function (e) {
    e.preventDefault();
    this.props.onReset();
  },

  render: function () {
    var name = this.props.name;
    var filteredLength = this.props.currentLength;
    var totalLength = this.props.totalLength;

    var filteredClassSet = classNames({
      "h4": true,
      "hidden": filteredLength === totalLength
    });

    var unfilteredClassSet = classNames({
      "h4": true,
      "hidden": filteredLength !== totalLength
    });

    var anchorClassSet = classNames({
      "h4 clickable": true,
      "hidden": filteredLength === totalLength
    });

    return (
      <ul className="list-unstyled list-inline inverse">
        <li className={filteredClassSet}>
          Showing {filteredLength} of {totalLength} {name}
        </li>
        <li className={anchorClassSet} onClick={this.handleReset}>
          <a className="small">
            (Show all)
          </a>
        </li>
        <li className={unfilteredClassSet}>
          {totalLength} {name}
        </li>
      </ul>
    );
  }
});

module.exports = FilterHeadline;
