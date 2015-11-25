/*eslint-disable no-unused-vars*/
import React from "react/addons";
/*eslint-enable no-unused-vars*/

const TabsUtil = {

  getTabLinks: function (tabs, currentTab, getElement) {
    let tabSet = Object.keys(tabs);

    return tabSet.map(function (tab, index) {
      return getElement(tab, currentTab === tab, index);
    });
  }

};

export default TabsUtil;
