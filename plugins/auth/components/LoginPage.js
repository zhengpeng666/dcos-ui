import React from 'react';

import _LoginModal from './LoginModal';

module.exports = (PluginSDK) => {

  let LoginModal = _LoginModal(PluginSDK);

  class LoginPage extends React.Component {
    render() {
      return <LoginModal />;
    }
  }
  return LoginPage;
};
