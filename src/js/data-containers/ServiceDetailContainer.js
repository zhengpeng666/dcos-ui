import Relay from 'react-relay';

import ServiceDetail from '../components/ServiceDetail';

module.exports = Relay.createContainer(ServiceDetail, {
  // For each of the props that depend on server data, we define a corresponding
  // key in `fragments`. Here, the component expects server data to populate the
  // `service` prop, so we'll specify the fragment from above as `fragments.service`.
  fragments: {
    service: () => Relay.QL`
      fragment on Service {
        id
        username
      }
    `
  }
});
