import React from 'react';

import Breadcrumbs from './Breadcrumbs';
import PageHeader from './PageHeader';
import ServiceImages from '../constants/ServiceImages';
import TabView from './utils/TabView';
import Tab from './utils/Tab';

import PodDetailInstancesTab from './PodDetailInstancesTab';

const METHODS_TO_BIND = [
  'handleNewTabButtons',
  'handleTabChange'
];

class PodDetail extends React.Component {

  constructor() {
    super(...arguments);

    this.state = {
      activeTab: 0,
      navigationTabButtons: []
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

  }

  /**
   * Handle the user action for changing a tab
   *
   * @param {number} tabIndex - The index of the tab the user just clicked
   */
  handleTabChange(tabIndex) {
    this.setState({
      activeTab: tabIndex
    });
  }

  /**
   * Handle the TabView updates to the tab buttons
   *
   * Since we are not rendering the tab buttons on top of the tab view,
   * we are using this callback to update the header with the new tab buttons.
   *
   * @param {array} buttons - The array of the new button React.Component elements
   */
  handleNewTabButtons(buttons) {
    console.log('Buttons:', buttons);
    this.setState({
      navigationTabButtons: buttons
    });
  }

  getActionButtons() {
    return [
      <button className="button flush-bottom  button-primary"
        key="action-button-scale">
        Scale
      </button>
    ];
  }

  getSubHeader() {
    return (
        <span className="media-object-item">
          This is a test
        </span>
      );
  }

  getHeader() {
    let pod = this.props.pod;
    let serviceIcon = (
      <img src={ServiceImages.NA_IMAGES['icon-large']} />
    );

    return (
      <PageHeader
        actionButtons={this.getActionButtons()}
        icon={serviceIcon}
        iconClassName="icon-image-container icon-app-container"
        subTitle={this.getSubHeader(pod)}
        navigationTabs={this.state.navigationTabButtons}
        title="That's a POD" />
      );
  }

  render() {
    let {pod} = this.props;

    return (
      <div className="flex-container-col">
        <div className="container-pod
          container-pod-divider-bottom-align-right
          container-pod-short-top flush-bottom flush-top
          service-detail-header media-object-spacing-wrapper
          media-object-spacing-narrow">
          <Breadcrumbs />
          {this.getHeader()}

          <TabView
            activeTab={this.state.activeTab}
            renderTabButtons={false}
            onTabButtonsDefined={this.handleNewTabButtons}
            onTabChange={this.handleTabChange} >

            <Tab label="Instances">
              <PodDetailInstancesTab pod={pod} />
            </Tab>

            <Tab label="Configuration">
              <div>TODO: Add content</div>
            </Tab>

            <Tab label="Debug">
              <div>Properties:</div>
              <pre>{JSON.stringify(this.props)}</pre>
              <div>State:</div>
              <pre>{JSON.stringify(this.state)}</pre>
            </Tab>

            <Tab label="Volumes">
              <div>TODO: Add content</div>
            </Tab>

          </TabView>

        </div>
      </div>
    );
  }
}

PodDetail.contextTypes = {
  router: React.PropTypes.func
};

PodDetail.propTypes = {
};

module.exports = PodDetail;
