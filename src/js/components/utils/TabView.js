import classNames from 'classnames';
import React from 'react';

import ValidatorUtil from '../../utils/ValidatorUtil';

const METHODS_TO_BIND = [
  'handleTabButtonClick'
];

/**
 * High-order tabs component for cleaner design.
 *
 * <TabView
 *    activeTab="this.state.activeTab"
 *    renderTabButtons={true}
 *    onTabChange={ (tabID) => this.setState({activeTab: tabID}) } >
 *
 *   <Tab
 *      label="title"
 *
 *      notificationCount="3"
 *      buttonClasses="custom-button-class"
 *
 *      getButtonContents={function(onClickCallback){ return (<Button onClick={onClickCallback}>{this.props.label}</Button>) }} >
 *
 *      <!-- Tab Contents -->
 *
 *   </Tab>
 *
 * </TabView>
 *
 */
class TabView extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.tabButtons = null;

  }

  componentWillMount() {
    this.regenTabButtons(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.haveButtonsChanged(this.props, nextProps)) {
      this.regenTabButtons(nextProps);
    }
  }

  haveButtonsChanged(prevProps, nextProps) {

    // First of all check if we changed tab
    if (prevProps.activeTab !== nextProps.activeTab) {
      return true;
    }

    // Get children as an array and compare their size
    let prevChildren = this.getChildrenArray(prevProps.children);
    let nextChildren = this.getChildrenArray(nextProps.children);
    if (prevChildren.length !== nextChildren.length) {
      return true;
    }

    // Finaly compare changes on important properties
    return prevChildren.reduce(function (hasChanged, prevChild, index) {
      if (hasChanged) {
        return true;
      }

      let nextChild = nextChildren[index];
      return prevChild.props.label !== nextChild.props.label ||
              prevChild.props.notificationCount !== nextChild.props.notificationCount ||
              prevChild.props.linkTo !== nextChild.props.linkTo;

    }, false);
  }

  /**
   * Handle the click to the appropriate tab button
   *
   * @param {Number} id - The id of the tab
   */
  handleTabButtonClick(id) {
    if (this.props.onTabChange) {
      let children = this.getChildrenArray();
      this.props.onTabChange(id, children[id]);
    }
  }

  /**
   * Returns an array of children, even in cases were there is only one child
   *
   * @param {Any} children - The value of the `props.children` property
   * @returns {Array} - Returns the children as an array even if there is only one or none
   */
  getChildrenArray(children) {
    if (!children) {
      return [];
    }
    if (!Array.isArray(children)) {
      return [children];
    }
    return children;
  }

  /**
   * Resolve the correct value for the activeTab property into
   * an integer pointing to the appropriate tab to activate.
   *
   * @param {Any} activeTab - The value of the `props.activeTab` property
   * @param {Array} children - The children array as returned from getChildrenArray
   * @returns {Number} - Returns the active tab ID
   */
  getActiveTabId(activeTab, children = []) {

    // If missing, default to first
    // This covers cases of: 0, '', null, undefined
    if (!activeTab) {
      return 0;
    }

    // If this is numeric, return the number bound in the correct range
    if (ValidatorUtil.isNumber(activeTab)) {
      activeTab = parseInt(activeTab);
      if (activeTab < 0) {
        return 0;
      } else if (activeTab >= children.length) {
        return children.length-1;
      }

      // Return correct tab
      return activeTab;
    }

    // If it's not numeric, look-up the correct tab based on it's `id` property
    activeTab = children.findIndex(function (child) {
      let {id} = child.props;
      return id === activeTab;
    });

    // If not found, return first item
    if (activeTab < 0) {
      return 0;
    }
    return activeTab;

  }

  /**
   * Re-generate tab buttons and store them in the `this.tabButtons` property
   *
   * @param {object} props - The properties to use for tab generation
   */
  regenTabButtons(props) {
    let tabs = this.getChildrenArray(props.children);
    let activeTabId = this.getActiveTabId(props.activeTab, tabs);
    let clickHandler = this.handleTabButtonClick;

    let buttons = tabs.map(function (tab, index) {
      let tabClass = classNames({
        'tab-item': true,
        'active': index === activeTabId
      });

      // The following block of code will call the `getButtonContents`
      // from the tabs, making sure the `this` keyword is bound to the
      // button's class instance.
      return (
        <li className={tabClass} key={index}>
          {tab.props.getButtonContents.call(tab, clickHandler.bind(null, index))}
        </li>
      );
    });

    // Keep a local reference to the tab buttons DOM structure
    this.tabButtons = (
        <ul className="tabs list-inline flush-bottom container-pod
          container-pod-short-top inverse">
          {buttons}
        </ul>
      );

    // Call the user-provided callback to optionally re-render the DOM
    // with the updated tab buttons.
    if (this.props.onTabButtonsDefined) {
      this.props.onTabButtonsDefined(this.tabButtons);
    }

  }

  /**
   * Return the contents of the active tab child
   *
   * @returns {React.Component} - Returns the active tab contents
   */
  getActiveTabContents() {
    let children = this.getChildrenArray(this.props.children);
    return children[this.getActiveTabId(this.props.activeTab, children)];
  }

  /**
   * The render function returns only the contents of the active tab view
   * and optionally the tab buttons if the `renderTabButtons` property is set
   *
   * @returns {React.Component} - The rendered content
   */
  render() {

    // Optionally render tab buttons
    let tabButtons = null;
    if (this.props.renderTabButtons) {
      tabButtons = this.tabButtons;
    }

    return (
        <div>
          {tabButtons}
          <div className="tab-view">
            {this.getActiveTabContents()}
          </div>
        </div>
      );
  }

};

TabView.propTypes = {
  activeTab: React.PropTypes.any,
  onTabChange: React.PropTypes.func,
  onTabButtonsDefined: React.PropTypes.func,
  renderTabButtons: React.PropTypes.bool
};

TabView.defaultProps = {
  activeTab: 0,
  onTabChange: undefined,
  onTabButtonsDefined: undefined,
  renderTabButtons: true
};

module.exports = TabView;
