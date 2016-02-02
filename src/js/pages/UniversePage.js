/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

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
