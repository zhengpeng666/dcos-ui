var classNames = require("classnames");
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
        <h4 className="panel-title inverse">
          {title}
        </h4>
      </div>
    );
  },

  getPanelContents: function () {
    return React.Children.map(this.props.children, function (child) {
      return child;
    });
  },

  render: function () {
    var classes = {
      "panel": true
    };
    if (this.props.className) {
      classes[this.props.className] = true;
    }

    var classSet = classNames(classes);

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
