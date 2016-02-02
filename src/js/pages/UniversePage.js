import React from 'react';

export default class UniversePage extends React.Component {

  render() {
    return (
      <h1 className="inverse text-align-center">Dat Cosmos</h1>
    );
  }
}

UniversePage.contextTypes = {
  router: React.PropTypes.func
};

UniversePage.routeConfig = {
  label: 'Universe',
  icon: 'universe',
  matches: /^\/universe/
};
