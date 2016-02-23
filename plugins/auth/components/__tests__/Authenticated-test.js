jest.dontMock('../Authenticated');
jest.dontMock('../../../../src/js/mixins/GetSetMixin');
jest.dontMock('../../stores/ACLAuthStore');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var Authenticated = require('../Authenticated');
var ACLAuthStore = require('../../stores/ACLAuthStore');

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
