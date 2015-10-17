var _ = require("underscore");
var classNames = require("classnames");
var GeminiScrollbar = require("react-gemini-scrollbar");
var React = require("react/addons");

var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var SidebarToggle = require("../components/SidebarToggle");

var Page = React.createClass({

  displayName: "Page",

  mixins: [InternalStorageMixin],

  propTypes: {
    title: React.PropTypes.string,
    renderNavigation: React.PropTypes.func
  },

  componentDidMount: function () {
    this.internalStorage_set({
      rendered: true
    });
    this.forceUpdate();
  },

  getNavigation: function () {
    if (_.isFunction(this.props.renderNavigation)) {
      return this.props.renderNavigation();
    } else {
      return <div className="page-header-navigation" />;
    }
  },

  getChildren: function () {
    var data = this.internalStorage_get();
    if (data.rendered === true) {
      return this.props.children;
    }
    return null;
  },

  render: function () {
    var classes = {
      "page": true,
      "flex-container-col": true
    };
    if (this.props.className) {
      classes[this.props.className] = true;
    }

    var classSet = classNames(classes);

    return (
      <div className={classSet}>
        <div className="page-header">
          <div className="container container-fluid container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-inverse container-pod-divider-bottom-align-right">
            <div className="page-header-context">
              <SidebarToggle />
              <h1 className="page-header-title inverse flush">
                {this.props.title}
              </h1>
            </div>
            {this.getNavigation()}
          </div>
        </div>
        <GeminiScrollbar autoshow={true} className="page-content container-scrollable inverse">
          <div className="container container-fluid container-pod">
            {this.getChildren()}
          </div>
        </GeminiScrollbar>
      </div>
    );
  }
});

module.exports = Page;
