import classNames from "classnames";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/
import { Link } from "react-router";

const TabsMixin = {

  getTabClassSet(customClasses="") {
    return Object.keys(this.tabs).map(function (tab) {
      let classSet = classNames({
        "button button-link": true,
        "button-primary": this.state.currentTab === tab
      });
      if (customClasses) {
        classSet += " " + customClasses;
      }

      return classSet;
    }, this);
  },

  tabs_getTabs(customClasses="") {
    let tabSet = Object.keys(this.tabs);

    return this.getTabClassSet(customClasses).map(function (classSet, i) {
      return (
        <div
          key={i}
          className={classSet}
          onClick={this.tabs_handleTabClick.bind(this, tabSet[i])}>
          {this.tabs[tabSet[i]]}
        </div>
      );
    }, this);
  },

  tabs_getTabLinks(customClasses="") {
    let tabSet = Object.keys(this.tabs);

    return this.getTabClassSet(customClasses).map(function (classSet, i) {
      return (
        <Link
          key={i}
          to={tabSet[i]}
          className={classSet}
          onClick={this.tabs_handleTabClick.bind(this, tabSet[i])}>
            {this.tabs[tabSet[i]]}
        </Link>
      );
    }, this);
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
