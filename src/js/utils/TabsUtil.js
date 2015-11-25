/*eslint-disable no-unused-vars*/
import React from "react/addons";
/*eslint-enable no-unused-vars*/

const TabsUtil = {

  /**
   * Returns an array of tabs to be rendered
   * @param  {Object} tabs       with a key for each tab to render
   * @param  {String} currentTab currently active tab
   * @param  {Function} getElement render function to render each element
   * @return {Array}            of tabs to render
   */
  getTabs: function (tabs, currentTab, getElement) {
    let tabSet = Object.keys(tabs);

    return tabSet.map(function (tab, index) {
      return getElement(tab, currentTab === tab, index);
    });
  }

};

export default TabsUtil;
