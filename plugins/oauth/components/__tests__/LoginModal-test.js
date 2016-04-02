jest.dontMock('../LoginModal');

/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import ReactDOM from 'react-dom';

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock([
  'MarathonStore',
  'MetadataStore',
  'AuthStore',
  'MesosStateStore',
  'MesosSummaryStore',
  'PluginGetSetMixin',
  'ClusterHeader',
  'DCOSLogo',
  'ClusterName'
]);

let SDK = PluginTestUtils.getSDK('authentication', {enabled: true});

require('../../SDK').setSDK(SDK);

let LoginModal = require('../LoginModal');

let AuthStore = SDK.get('AuthStore');

describe('LoginModal', function () {

  beforeEach(function () {
    this.container = document.createElement('div');

    this.instance = ReactDOM.render(
      <LoginModal />,
      this.container

    );
  });


  afterEach(function () {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#handleLoginSubmit', function () {
    beforeEach(function () {
      this.originalLogin = AuthStore.login;
      AuthStore.login = jasmine.createSpy();

      this.model = {name: 'kenny'};
      this.instance.handleLoginSubmit(this.model);
    });

    afterEach(function () {
      AuthStore.login = this.originalLogin;
    });

    it('should set disable the login modal while request pending', function () {
      expect(this.instance.state.disableLogin).toEqual(true);
    });

    it('should call AuthStore#login with the model', function () {
      expect(AuthStore.login).toHaveBeenCalledWith(this.model);
    });
  });

  describe('#onAuthStoreSuccess', function () {

    beforeEach(function () {
      spyOn(AuthStore, 'getUser').andReturn({uid: 'foo'});
      AuthStore.fetchRole = jasmine.createSpy();
    });

    it('calls fetch role', function () {
      this.instance.onAuthStoreSuccess();
      expect(AuthStore.fetchRole.callCount).toEqual(1);
    });

  });

  describe('#onAuthStoreError', function () {
    beforeEach(function () {
      this.instance.onAuthStoreError();
    });

    it('should enable the modal', function () {
      expect(this.instance.state.disableLogin).toEqual(false);
    });

    it('should set the errorMsg to state', function () {
      expect(this.instance.state.errorMsg)
        .toEqual('Username and password do not match.');
    });
  });

  describe('#onAuthStoreRoleChange', function () {
    beforeEach(function () {
      this.instance.context = {
        router: {
          transitionTo: jasmine.createSpy()
        }
      };

      this.nextRoute = null;
      this.originalGet = AuthStore.get;
      this.originalIsAdmin = AuthStore.isAdmin;
      AuthStore.get = function () {
        return this.nextRoute;
      }.bind(this);
      AuthStore.isAdmin = function () { return true; };
    });

    afterEach(function () {
      AuthStore.get = this.originalGet;
      AuthStore.isAdmin = this.originalIsAdmin;
    });

    it('should enable the modal', function () {
      this.instance.onAuthStoreRoleChange();
      expect(this.instance.state.disableLogin).toEqual(false);
    });

    it('should transitionTo \'access-denied\' if not admin', function () {
      var prevIsAdmin = AuthStore.isAdmin;
      AuthStore.isAdmin = function () { return false; };

      this.instance.onAuthStoreRoleChange();
      expect(this.instance.context.router.transitionTo)
        .toHaveBeenCalledWith('/access-denied');

      AuthStore.isAdmin = prevIsAdmin;
    });

    it('should transitionTo \'/\' if admin', function () {
      this.instance.onAuthStoreRoleChange();
      expect(this.instance.context.router.transitionTo)
        .toHaveBeenCalledWith('/');
    });

    it('should transitionTo the redirect route if it exists', function () {
      this.nextRoute = 'services';
      this.instance.onAuthStoreRoleChange();
      expect(this.instance.context.router.transitionTo)
        .toHaveBeenCalledWith('services');
    });
  });
});
