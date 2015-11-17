import {HashLocation} from "react-router";

import GetSetMixin from "../mixins/GetSetMixin";
import Store from "../utils/Store";

var HistoryStore = Store.createStore({
  mixins: [GetSetMixin],

  init: function () {
    this.set({
      history: [HashLocation.getCurrentPath()]
    });

    HashLocation.addChangeListener(change => {
      // The router will call the callback with a different context
      // this is why this is here
      this.onHashChange(change);
    });
  },

  onHashChange: function (change) {
    let history = this.get("history");

    if (change.type === "pop") {
      history.pop();
    } else if (change.type === "push") {
      history.push(change.path);
    }

    this.set({history});
  },

  /**
   * Returns the history at an offset
   * Passing 0 to the method will return current position
   *
   * @param  {Number} offset Should always be 0 or a negative number
   * @return {String|undefined} Path in history location if found
   */
  getHistoryAt: function (offset) {
    let history = this.get("history");
    return history[history.length - 1 + offset];
  },

  goBack: function (router) {
    let prevPath = HistoryStore.getHistoryAt(-1);
    if (prevPath) {
      router.transitionTo(prevPath);
      HistoryStore.get("history").pop();
      HistoryStore.get("history").pop();
      return;
    }

    let routes = router.getCurrentRoutes();
    let pageBefore = routes[routes.length - 2];
    router.transitionTo(pageBefore.name);

  }
});

module.exports = HistoryStore;
