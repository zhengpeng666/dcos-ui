var classNames = require('classnames');
var React = require('react/addons');

var Panel = React.createClass({

  displayName: 'Panel',

  propTypes: {
    contentClass: React.PropTypes.string,
    title: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getHeading: function () {
    var title = this.props.title;
    if (title == null || title === '') {
      return null;
    }

    return (
      <div className="panel-heading text-align-center">
        <h5 className="panel-title inverse">
          {title}
        </h5>
      </div>
    );
  },

  getPanelContents: function () {
    return React.Children.map(this.props.children, function (child) {
      return child;
    });
  },

  render: function () {
    let {props} = this;
    var classes = {
      'panel': true
    };
    if (props.className) {
      classes[props.className] = true;
    }

    var classSet = classNames(classes);

    let contentClasses = classNames('panel-content', props.contentClass);

    return (
      <div {...props} className={classSet} style={props.style}>
        {this.getHeading()}
        <div className={contentClasses}>
          {this.getPanelContents()}
        </div>
      </div>
    );
  }
});

module.exports = Panel;
