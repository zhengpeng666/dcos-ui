jest.dontMock('../UserSidePanel');
jest.dontMock('../UserSidePanelContents');
jest.dontMock('../../../../storeConfig');

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock([
  'InternalStorageMixin',
  'TabsMixin',
  'SidePanelContents'
]);

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

require('../../../../storeConfig').register();
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
var ReactDOM = require('react-dom');

var ACLUserStore = require('../../stores/ACLUserStore');
var UserSidePanel = require('../UserSidePanel');
var UserSidePanelContents = require('../UserSidePanelContents');

var MesosSummary = require('../../../../structs');

describe('UserSidePanel', function () {
  beforeEach(function () {
    this.userStore = ACLUserStore.getUser;

    this.container = document.createElement('div');

    MesosSummary.getState = function () {
      return true;
    };

    ACLUserStore.getUser = function () {
      return {
        'uid': 'user',
        'url': '/users/user',
        'description': 'user description'
      };
    };
  });

  afterEach(function () {
    ACLUserStore.getUser = this.userStore;
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#isOpen', function () {
    beforeEach(function () {
      this.params = {
        userID: null
      };
      this.instance = ReactDOM.render(
        <UserSidePanel
          params={this.params}
          openedPage="settings-organization-users" />,
        this.container
      );
    });

    it('should return false if all IDs are null', function () {
      expect(this.instance.isOpen()).toEqual(false);
    });

    it('should return true if new userID received', function () {
      var prevUserID = this.params.userID;
      this.params.userID = 'username';
      expect(this.instance.isOpen()).toEqual(true);
      this.params.userID = prevUserID;
    });
  });

  describe('#getContents', function () {
    beforeEach(function () {
      this.params = {
        userID: null
      };
      this.instance = ReactDOM.render(
        <UserSidePanel
          statesProcessed={true}
          params={this.params} />,
        this.container
      );
    });

    it('should return UserSidePanelContents if userID is set',
      function () {
        this.params.userID = 'set';
        var contents = this.instance.getContents(this.params.userID);

        expect(contents.type.toString() === UserSidePanelContents.toString()).toEqual(true);
        this.params.serviceName = null;
      }
    );

  });
});
