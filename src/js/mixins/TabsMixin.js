import classNames from "classnames";
import { Link } from "react-router";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import TabsUtil from "../utils/TabsUtil";

const TabsMixin = {

  tabs_getLink(customClasses, tab, isActive) {
    let tabClass = classNames({
      "active": isActive
    });

    return (
      <li className={tabClass}>
        <Link
          key={tab}
          to={tab}
          className={customClasses}
          onClick={this.tabs_handleTabClick.bind(this, tab)}>
          {this.tabs_tabs[tab]}
        </Link>
      </li>
    );
  },

  tabs_getSpan(customClasses, tab, isActive) {
    let tabClass = classNames({
      "active": isActive
    });

    return (
      <li className={tabClass}>
        <span
          key={tab}
          className={customClasses}
          onClick={this.tabs_handleTabClick.bind(this, tab)}>
          {this.tabs_tabs[tab]}
        </span>
      </li>
    );
  },

  tabs_getTabs(customClasses) {
    return TabsUtil.getTabLinks(
      this.tabs_tabs,
      this.state.currentTab,
      this.tabs_getSpan.bind(this, customClasses)
    );
  },

  tabs_getTabLinks(customClasses) {
    return TabsUtil.getTabLinks(
      this.tabs_tabs,
      this.state.currentTab,
      this.tabs_getLink.bind(this, customClasses)
    );
  },

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
