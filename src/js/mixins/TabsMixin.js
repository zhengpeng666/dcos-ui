import classNames from "classnames";
import { Link } from "react-router";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import TabsUtil from "../utils/TabsUtil";

const TabsMixin = {

  /**
   * Will return an li component with an active Link and an onClick handler
   * @param  {String}  customClasses to be added to the Link item
   * @param  {String}  tab           key of tab to render
   * @param  {Boolean} isActive      whether the current tab is active or not
   * @return {Component}             React component to render
   */
  tabs_getRoutedItem(customClasses, tab, isActive) {
    let tabClass = classNames({
      "active": isActive
    });

    return (
      <li className={tabClass} key={tab}>
        <Link
          to={tab}
          className={customClasses}
          onClick={this.tabs_handleTabClick.bind(this, tab)}>
          {this.tabs_tabs[tab]}
        </Link>
      </li>
    );
  },

  /**
   * Will return a span with only an onClick handler
   * @param  {String}  customClasses to be added to the Link item
   * @param  {String}  tab           key of tab to render
   * @param  {Boolean} isActive      whether the current tab is active or not
   * @return {Component}             React component to render
   */
  tabs_getUnroutedItem(customClasses, tab, isActive) {
    let tabClass = classNames({
      "active": isActive
    });

    return (
      <li className={tabClass} key={tab}>
        <span
          className={customClasses}
          onClick={this.tabs_handleTabClick.bind(this, tab)}>
          {this.tabs_tabs[tab]}
        </span>
      </li>
    );
  },

  /**
   * Will return an array of tabs to be rendered.
   * Will only have onClick handlers
   * @param  {String} customClasses to be added to the active component
   * @return {Array}               of tabs to render
   */
  tabs_getTabs(customClasses) {
    return TabsUtil.getTabs(
      this.tabs_tabs,
      this.state.currentTab,
      this.tabs_getUnroutedItem.bind(this, customClasses)
    );
  },

  /**
   * Will return an array of routed tabs to be rendered.
   * Will have onClick handlers and active Link components with routes
   * @param  {String} customClasses to be added to the active component
   * @return {Array}               of tabs to render
   */
  tabs_getRoutedTabs(customClasses) {
    return TabsUtil.getTabs(
      this.tabs_tabs,
      this.state.currentTab,
      this.tabs_getRoutedItem.bind(this, customClasses)
    );
  },

  /**
   * Calls the function to render the active tab
   * @return {Component} the result of the appropriate render function
   */
  tabs_getTabView() {
    let currentTab = this.tabs_tabs[this.state.currentTab];
    let renderFunction = this[`render${currentTab}TabView`];

    if (renderFunction == null) {
      return null;
    }

    return renderFunction.apply(this);
  },

  tabs_handleTabClick(nextTab) {
    this.setState({currentTab: nextTab});
  }
};

export default TabsMixin;
