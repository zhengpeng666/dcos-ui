jest.dontMock('../Authenticated');
jest.dontMock('../../../../mixins/GetSetMixin');
jest.dontMock('../../../../stores/ACLAuthStore');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var Authenticated = require('../Authenticated');
var ACLAuthStore = require('../../../../stores/ACLAuthStore');

class FakeComponent extends React.Component {
  render() {
    return <div>fakeComponent</div>;
  }
}

describe('Authenticated', function () {
  beforeEach(function () {

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
    ACLAuthStore.isLoggedIn = this.originalIsLoggedIn;
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
    var renderedComponent = TestUtils.renderIntoDocument(<this.instance />);
    var component =
      TestUtils.findRenderedDOMComponentWithTag(renderedComponent, 'div');
    expect(ReactDOM.findDOMNode(component).textContent).toBe('fakeComponent');
  });

});
