import React from 'react';

module.exports = (PluginSDK) => {

  class OverviewTab extends React.Component {
    render() {
      return (
        <h3 className="flush">No access.</h3>
      );
    }
  }
  return OverviewTab;
};
