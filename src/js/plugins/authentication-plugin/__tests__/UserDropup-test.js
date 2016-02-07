jest.dontMock('../UserDropup');
jest.dontMock('../../../stores/ACLAuthStore');
jest.dontMock('../../../events/ACLAuthActions');
jest.dontMock('../../../constants/ActionTypes');
jest.dontMock('../../../constants/ACLAuthConstants');
jest.dontMock('../../../events/AppDispatcher');
jest.dontMock('../../../constants/EventTypes');
jest.dontMock('../../../mixins/GetSetMixin');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

var ACLAuthStore = require('../../../stores/ACLAuthStore');
var UserDropup = require('../UserDropup');

describe('UserDropup', function () {

  beforeEach(function () {
    this.getUser = ACLAuthStore.getUser;

    ACLAuthStore.getUser = function () {
      return {
        description: 'foo'
      };
    };

    let mockProps = {
      onClick: jest.genMockFunction()
    };

    let dropdownItems = [
      <div foo="bar" key="foo" type="a" props={mockProps} />,
      <div bar="baz" key="bar" type="a" props={mockProps} />,
      <div baz="qux" key="baz" type="a" props={mockProps} />
    ];

    this.instance = TestUtils.renderIntoDocument(
      <UserDropup items={dropdownItems} />
    );

    this.instance.dropdownItems = dropdownItems;
  });

  afterEach(function () {
    ACLAuthStore.getUser = this.getUser;
  });

  describe('#getDropdownMenu', function () {

    it('returns the array it was passed with a default item at the beginning',
      function () {
      let dropdownMenu = this.instance.getDropdownMenu([
        <div foo="bar" />,
        <div bar="baz" />
      ]);

      expect(dropdownMenu.length).toEqual(3);
      expect(dropdownMenu[0].id).toEqual('default-item');
    });

  });

  describe('#getModalMenu', function () {

    beforeEach(function () {
      this.modalMenu = this.instance.getModalMenu([
        <div key="foo" />,
        <div key="bar" />
      ]);
    });

    it('should return an array of the same length it received', function () {
      expect(this.modalMenu.length).toEqual(2);
    });

    it('should return an array of li elements', function () {
      this.modalMenu.forEach(function (item) {
        let domEl = TestUtils.renderIntoDocument(item);
        expect(domEl.getDOMNode().nodeName).toEqual('LI');
      });
    });

  });

  describe('#getUserMenuItems', function () {

    it('should return all of the items passed, in addtion to a signout button',
      function () {
      let menuItems = this.instance.getUserMenuItems();
      let signoutButton = menuItems[menuItems.length - 1];

      expect(menuItems.length).toEqual(this.instance.dropdownItems.length + 1);
      expect(signoutButton.key).toEqual('button-sign-out');
    });

  });

});
