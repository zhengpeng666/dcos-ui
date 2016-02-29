jest.dontMock('../Authenticated');
jest.dontMock('../../stores/ACLAuthStore');
jest.dontMock('../../actions/ACLAuthActions');

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock('PluginGetSetMixin');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

let PluginSDK = PluginTestUtils.getSDK('Auth', {enabled: true});

let Authenticated = require('../Authenticated')(PluginSDK);
let ACLAuthStore = require('../../stores/ACLAuthStore')(PluginSDK);

class FakeComponent extends React.Component {
  render() {
    return <div>fakeComponent</div>;
  }
}

describe('Authenticated', function () {
  beforeEach(function () {
    this.container = document.createElement('div');
    this.originalWillTransitionTo = Authenticated.willTransitionTo;
    this.originalIsLoggedIn = ACLAuthStore.isLoggedIn;
    this.callback = jasmine.createSpy();
    ACLAuthStore.isLoggedIn = function () {
      return false;
    };

    this.instance = new Authenticated(FakeComponent);
  });

  afterEach(function () {
    Authenticated.willTransitionTo = this.originalWillTransitionTo;
    ACLAuthStore.removeAllListeners();
    ACLAuthStore.isLoggedIn = this.originalIsLoggedIn;

    ReactDOM.unmountComponentAtNode(this.container);
  });

  it('should reditect to /login if user is not logged in', function () {
    this.callback = jasmine.createSpy();
    this.instance.willTransitionTo({
      redirect: this.callback
    });
    expect(this.callback).toHaveBeenCalledWith('/login');
  });

  it('shouldn\'t call redirect when user is not logged in', function () {
    ACLAuthStore.isLoggedIn = function () {
      return true;
    };
    this.callback = jasmine.createSpy();
    this.instance.willTransitionTo({
      redirect: this.callback
    });
    expect(this.callback).not.toHaveBeenCalled();
  });

  it('should render component when user is logged in', function () {
    var renderedComponent = ReactDOM.render(<this.instance />, this.container);
    var component =
      TestUtils.findRenderedDOMComponentWithTag(renderedComponent, 'div');
    expect(ReactDOM.findDOMNode(component).textContent).toBe('fakeComponent');
  });

});
