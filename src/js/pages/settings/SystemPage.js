import classNames from "classnames";
import { Link } from "react-router";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import Page from "../../components/Page";
import RouteUtil from "../../utils/RouteUtil";
import TabsMixin from "../../mixins/TabsMixin";
import Util from "../../utils/Util";

export default class SystemPage extends Util.mixin(TabsMixin) {

  constructor() {
    super();

    this.tabs = {
      "settings-system-overview": "Overview"
    };

    this.state = {
      currentTab: Object.keys(this.tabs).shift()
    };
  }

  componentWillMount() {
    let routes = this.context.router.getCurrentRoutes();
    let currentRoute = routes[routes.length - 1].name;

    if (Object.keys(this.tabs).indexOf(currentRoute) >= 0) {
      this.setState({currentTab: currentRoute});
    }
  }

  getClassSet(isActive) {
    return classNames({
      "h1 page-header-title inverse flush": true,
      "active": isActive
    });
  }

  getLink(tab, isActive, tabSet) {
    return (
      <Link
        key={tab}
        to={tabSet[tab]}
        className={this.getClassSet(isActive)}>
        {this.props.tabs[tabSet[tab]]}
      </Link>
    );
  }

  getTitle() {
    let routes = this.context.router.getCurrentRoutes();
    let currentRoute = routes[routes.length - 2].name;

    return (
      <div>
        {RouteUtil.getTabLinks(
          this.props.tabs,
          currentRoute,
          this.getLink.bind(this)
        )}
      </div>
    );
  }

  render() {
    return (
      <Page
        title={this.getTitle()}
        navigation={this.tabs_getTabLinks()}>
        <h3 className="flush">No access.</h3>
      </Page>
    );
  }
}

SystemPage.contextTypes = {
  router: React.PropTypes.func
};
