jest.dontMock('../GroupSidePanelContents');
jest.dontMock('../../stores/ACLGroupStore');
jest.dontMock('../../../../storeConfig');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var ReactDOM = require('react-dom');

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock([
  'MesosSummaryStore',
  'InternalStorageMixin',
  'TabsMixin',
  'SidePanelContents',
  'RequestErrorMsg'
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

require('../../../../storeConfig').register();

let ACLGroupStore = require('../../stores/ACLGroupStore');
let EventTypes = require('../../constants/EventTypes');
let GroupSidePanelContents = require('../GroupSidePanelContents');
var OrganizationReducer = require('../../../../Reducer');

PluginTestUtils.addReducer('organization', OrganizationReducer);

let Group = require('../../structs/Group');

let groupDetailsFixture =
  require('../../../../../../tests/_fixtures/acl/group-with-details.json');
groupDetailsFixture.permissions = groupDetailsFixture.permissions.array;
groupDetailsFixture.users = groupDetailsFixture.users.array;

let {APPLICATION} = SDK.constants;

describe('GroupSidePanelContents', function () {

  beforeEach(function () {
    this.groupStoreGetGroup = ACLGroupStore.getGroup;

    SDK.Store.getState = function () {
      return {
        [APPLICATION]: {
          summary: {
            statesProcessed: true
          }
        }
      };
    };

    ACLGroupStore.getGroup = function (groupID) {
      if (groupID === 'unicode') {
        return new Group(groupDetailsFixture);
      }
    };
  });

  afterEach(function () {
    ACLGroupStore.getGroup = this.groupStoreGetGroup;
  });

  describe('#render', function () {
    beforeEach(function () {
      this.container = document.createElement('div');
    });
    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('should return error message if fetch error was received', function () {
      var groupID = 'unicode';
      this.instance = ReactDOM.render(
        <GroupSidePanelContents
          itemID={groupID}/>,
        this.container
      );

      ACLGroupStore.emit(EventTypes.ACL_GROUP_DETAILS_FETCHED_ERROR, groupID);

      var node = ReactDOM.findDOMNode(this.instance);
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
      var groupID = 'unicode';
      this.instance = ReactDOM.render(
        <GroupSidePanelContents
          itemID={groupID}/>,
        this.container
      );

      var node = ReactDOM.findDOMNode(this.instance);
      var loading = node.querySelector('.ball-scale');

      expect(loading).toBeTruthy();
    });

    it('should not return error message or loading screen if group is found',
      function () {
        var groupID = 'unicode';

        this.instance = ReactDOM.render(
          <GroupSidePanelContents
            itemID={groupID}/>,
          this.container
        );

        var node = ReactDOM.findDOMNode(this.instance);
        var text = node.querySelector('.form-element-inline-text');

        expect(text.textContent).toEqual('藍-遙 遥 悠 遼 Größe');
      }
    );

  });
});
