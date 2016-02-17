import classNames from 'classnames';
import React from 'react';

class SideTabs extends React.Component {
  getTabs() {
    let selectedTab = this.props.selectedTab;

    return this.props.tabs.map((tab, i) => {
      let classes = classNames('sidebar-menu-item', 'clickable', {
        selected: tab.title === selectedTab
      });

      return (
        <li
          className={classes}
          key={i}
          onClick={this.props.onTabClick.bind(null, tab.title)}>
          <a>
            {tab.title}
          </a>
        </li>
      );
    });
  }

  render() {
    return (
      <ul className={this.props.className}>
        {this.getTabs()}
      </ul>
    );
  }
}

SideTabs.defaultProps = {
  className: 'sidebar-tabs list-unstyled',
  onTabClick: function () {},
  tabs: []
};

SideTabs.propTypes = {
  className: React.PropTypes.string,
  onTabClick: React.PropTypes.func,
  selectedTab: React.PropTypes.string,
  tabs: React.PropTypes.array
};

module.exports = SideTabs;
