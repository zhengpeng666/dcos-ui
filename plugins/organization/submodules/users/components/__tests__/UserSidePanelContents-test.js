jest.dontMock('../UserSidePanelContents');
jest.dontMock('../../stores/ACLUserStore');

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock([
  'InternalStorageMixin',
  'TabsMixin',
  'SidePanelContents',
  'RequestErrorMsg',
  'MesosSummaryStore'
]);

PluginTestUtils.loadPluginsByName({
  authentication: {
    enabled: true
  },
  tracking: {
    enabled: true
  }
});

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
var ReactDOM = require('react-dom');

import {ACL_USER_DETAILS_FETCHED_ERROR} from '../../constants/EventTypes';

var ACLUserStore = require('../../stores/ACLUserStore');
var UserSidePanelContents = require('../UserSidePanelContents');
var OrganizationReducer = require('../../../../Reducer');

PluginTestUtils.addReducer('organization', OrganizationReducer);

var User = require('../../structs/User');

var userDetailsFixture =
  require('../../../../../../tests/_fixtures/acl/user-with-details.json');
userDetailsFixture.groups = userDetailsFixture.groups.array;

let {APPLICATION} = SDK.constants;

describe('UserSidePanelContents', function () {

  beforeEach(function () {
    require('../../../../SDK').setSDK(SDK);
    this.userStoreGetUser = ACLUserStore.getUser;

    this.container = document.createElement('div');

    SDK.Store.getState = function () {
      return {
        [APPLICATION]: {
          summary: {
            statesProcessed: true
          }
        }
      };
    };

    ACLUserStore.getUser = function (userID) {
      if (userID === 'unicode') {
        return new User(userDetailsFixture);
      }
    };
  });

  afterEach(function () {
    ACLUserStore.getUser = this.userStoreGetUser;

    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#render', function () {

    it('should return error message if fetch error was received', function () {
      var userID = 'unicode';

      var instance = ReactDOM.render(
        <UserSidePanelContents
          itemID={userID}/>,
        this.container
      );

      ACLUserStore.emit(ACL_USER_DETAILS_FETCHED_ERROR, userID);

      var node = ReactDOM.findDOMNode(instance);
      var text = node.querySelector('h3');

      expect(text.textContent)
        .toEqual('Cannot Connect With The Server');
    });

    it('should show loading screen if still waiting on Store', function () {
      SDK.Store.getState = function () {
        return {
          [APPLICATION]: {
            summary: {
              statesProcessed: false
            }
          }
        };
      };
      var userID = 'unicode';

      var instance = ReactDOM.render(
        <UserSidePanelContents
          itemID={userID}/>,
        this.container
      );

      var node = ReactDOM.findDOMNode(instance);
      var loading = node.querySelector('.ball-scale');

      expect(loading).toNotBe(null);
    });

    it('should not return error message or loading screen if user is found',
      function () {
        var userID = 'unicode';

        var instance = ReactDOM.render(
          <UserSidePanelContents
            itemID={userID}/>,
          this.container
        );

        var node = ReactDOM.findDOMNode(instance);
        var text = node.querySelector('.form-element-inline-text');

        expect(text.textContent).toEqual('藍-Schüler Zimmer verfügt über einen Schreibtisch, Telefon, Safe in Notebook-Größe');
      }
    );

  });
});
