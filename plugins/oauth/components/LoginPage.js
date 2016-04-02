import React from 'react';

let SDK = require('../SDK').getSDK();

let AuthStore = SDK.get('AuthStore');

let METHODS_TO_BIND = [
  'onMessage'
];

module.exports = class LoginPage extends React.Component {
  componentWillMount() {
    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    window.addEventListener('message', this.onMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  onMessage(event) {
    if (event.origin !== SDK.config.authLocation) {
      return;
    }

    let data = JSON.parse(event.data);

    switch (data.type) {
      case 'token':
        AuthStore.login({id_token: data.token});
        break;
      case 'error':
        global.location.href = '#/access-denied';
        break;
    }
  }

  render() {
    let location = SDK.config.authLocation;
    let firstUser = SDK.Store.getAppState()
      .config.config.clusterConfiguration.firstUser;

    let client = SDK.config.clientID;
    // TODO - get clusterID
    let cluster_id = 'foo';

    location += `/login?firstUser=${firstUser}&cluster_id=${cluster_id}
      &client=${client}`;

    return (
      <div
        className="iframe-wrapper"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh'}}>
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          id="oauth-iframe"
          src={location} />
      </div>
    );
  }
};
