import classNames from 'classnames';
import {Link} from 'react-router';
import React from 'react';

/**
 * Default function for the `getButtonContents` property.
 *
 * This function tries it's best to render a button for the given tab, but
 * since some tabs might be overly complicated on the way they decide to
 * render, the user is allowed to override this with a custom.
 *
 * @param {function} onClickCallback - The function to call when the user clicks the button
 * @returns {React.Component} - The contents of the component
 */
function defaultButtonRenderFunction(onClickCallback) {
  let tabLabelClass = classNames({'tab-item-label': true}, this.props.buttonClassNames);

  // Render a notification badge if notification count is defined and
  // is bigger than zero
  let notificationBadge = null;
  if (this.props.notificationCount) {
    notificationBadge = (
          <span className="badge-container badge-primary">
            <span className="badge text-align-center">{this.props.notificationCount}</span>
          </span>
      );
  }

  // If we have the linkTo attribute, then create a routable link.
  // Otherwise create a plain label
  if (this.props.linkTo) {
    return (
      <Link
        to={this.props.linkTo}
        className={tabLabelClass}
        onClick={onClickCallback}
        {...this.props.buttonAttributes}>
        <span className="tab-item-label-text">
          {this.tabs_tabs[tab]}
        </span>
        {notificationBadge}
      </Link>
    );

  } else {
    return (
      <span
        className={tabLabelClass}
        onClick={onClickCallback}
        {...this.props.buttonAttributes}>
        <span className="tab-item-label-text">
          {this.props.label}
        </span>
        {notificationBadge}
      </span>
    );

  }

}

/**
 * Tab component to be placed inside a <TabView />
 */
class Tab extends React.Component {
  constructor() {
    super(...arguments);
  }

  render() {
    return (
        <div className="tab-view-tab">{this.props.children}</div>
      );
  }
};

Tab.propTypes = {
  buttonAttributes: React.PropTypes.object,
  buttonClassNames: React.PropTypes.any,
  getButtonContents: React.PropTypes.func,
  label: React.PropTypes.string.isRequired,
  linkTo: React.PropTypes.string,
  notificationCount: React.PropTypes.number
};

Tab.defaultProps = {
  buttonAttributes: {},
  buttonClassNames: '',
  getButtonContents: defaultButtonRenderFunction,
  label: '',
  linkTo: '',
  notificationCount: 0
};

module.exports = Tab;
