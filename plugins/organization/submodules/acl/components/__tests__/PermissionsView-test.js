jest.dontMock('../PermissionsView');
jest.dontMock('../../stores/ACLStore');
jest.dontMock('../../actions/ACLActions');
jest.dontMock('../../../../storeConfig');

import PluginTestUtils from 'PluginTestUtils';

/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
var ReactDOM = require('react-dom');

let PluginSDK = PluginTestUtils.getSDK('Auth', {enabled: true});

var ACLList = require('../../../../../../src/js/structs/ACLList');
var ACLStore = require('../../stores/ACLStore')(PluginSDK);
var PermissionsView = require('../PermissionsView')(PluginSDK);

require('../../../../storeConfig')(PluginSDK);

describe('PermissionsView', function () {

  describe('#handleResourceSelection', function () {
    beforeEach(function () {
      var permissions = new ACLList({items: [
        {
          rid: 'foo',
          description: 'foo description'
        },
        {
          rid: 'bar',
          description: 'bar description'
        }
      ]});
      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <PermissionsView
          permissions={permissions.getItems()}
          itemID="quis"
          itemType="user"
          parentRouter={null} />,
        this.container
      );

      this.prevGrantUserActionToResource = ACLStore.grantUserActionToResource;
      ACLStore.grantUserActionToResource = jasmine.createSpy();
    });

    afterEach(function () {
      ACLStore.grantUserActionToResource = this.prevGrantUserActionToResource;
      ACLStore.removeAllListeners();
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('calls #grantUserActionToResource with an id', function () {
      this.instance.handleResourceSelection({id: 'foo'});

      expect(ACLStore.grantUserActionToResource)
        .toHaveBeenCalledWith('quis', 'access', 'foo');
    });

    it('shouldn\'t call #grantUserActionToResource when is default', function () {
      this.instance.handleResourceSelection({id: 'DEFAULT'});

      expect(ACLStore.grantUserActionToResource).not.toHaveBeenCalled();
    });
  });

});
