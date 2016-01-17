var classNames = require('classnames');
var React = require('react/addons');

var InternalStorageMixin = require('../mixins/InternalStorageMixin');
var DOMUtils = require('../utils/DOMUtils');
var Panel = require('./Panel');

var AlertPanel = React.createClass({

  displayName: 'AlertPanel',

  mixins: [InternalStorageMixin],

  propTypes: {
    title: React.PropTypes.string,
    iconClassName: React.PropTypes.string
  },

  componentWillMount: function () {
    this.internalStorage_set({height: 0});
  },

  componentDidMount: function () {
    var panel = this.refs.panel.getDOMNode();
    var width = DOMUtils.getComputedWidth(panel);
    this.internalStorage_set({height: width});
    this.forceUpdate();
  },

  getTitleClasses: function () {
    return classNames({
      inverse: true,
      'flush-top': !this.props.iconClassName
    });
  },

  render: function () {
    var data = this.internalStorage_get();
    var classes = {
      'container container-fluid container-pod': true
    };
    if (this.props.className) {
      classes[this.props.className] = true;
    }

    var classSet = classNames(classes);

    return (
      <div className={classSet}>
        <div className="column-small-offset-2 column-small-8 column-medium-offset-3 column-medium-6 column-large-offset-4 column-large-4">
          <Panel ref="panel"
            style={{height: data.height}}
            className="vertical-center text-align-center flush">
            <i className={this.props.iconClassName + ' flush-top'}></i>
            <h3 className={this.getTitleClasses()}>
              {this.props.title}
            </h3>
            {this.props.children}
          </Panel>
        </div>
      </div>
    );
  }
});

module.exports = AlertPanel;
