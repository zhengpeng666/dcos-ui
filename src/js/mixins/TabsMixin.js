import classNames from "classnames";
import { Link } from "react-router";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import RouteUtil from "../utils/RouteUtil";

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
          {this.tabs[tab]}
        </Link>
      </li>
    );
  },

  tabs_getDiv(customClasses, tab, isActive) {
    let tabClass = classNames({
      "active": isActive
    });

    return (
      <li className={tabClass}>
        <span
          key={tab}
          className={customClasses}
          onClick={this.tabs_handleTabClick.bind(this, tab)}>
          {this.tabs[tab]}
        </span>
      </li>
    );
  },

  tabs_getTabs(customClasses) {
    return RouteUtil.getTabLinks(
      this.tabs,
      this.state.currentTab,
      this.tabs_getDiv.bind(this, customClasses)
    );
  },

  tabs_getTabLinks(customClasses) {
    return RouteUtil.getTabLinks(
      this.tabs,
      this.state.currentTab,
      this.tabs_getLink.bind(this, customClasses)
    );
  },

  tabs_getTabView() {
    let currentTab = this.tabs[this.state.currentTab];
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
