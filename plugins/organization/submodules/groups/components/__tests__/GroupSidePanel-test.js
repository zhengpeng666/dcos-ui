jest.dontMock('../GroupSidePanel');
jest.dontMock('../GroupSidePanelContents');
jest.dontMock('../../stores/ACLGroupStore');
jest.dontMock('../../../../storeConfig');

/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
var ReactDOM = require('react-dom');

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock([
  'RequestUtil',
  'MesosSummaryStore',
  'MarathonStore',
  'InternalStorageMixin',
  'TabsMixin',
  'PluginGetSetMixin',
  'SidePanelContents'
]);

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

require('../../../../storeConfig').register();

var ACLGroupStore = require('../../stores/ACLGroupStore');
var GroupSidePanel = require('../GroupSidePanel');
var GroupSidePanelContents = require('../GroupSidePanelContents');

let {APPLICATION} = SDK.constants;

describe('GroupSidePanel', function () {
  beforeEach(function () {
    this.groupStore = ACLGroupStore.getGroup;

    SDK.Store.getState = function () {
      return {
        [APPLICATION]: {
          summary: {
            statesProcessed: true
          }
        }
      };
    };

    ACLGroupStore.getGroup = function () {
      return {
        'gid': 'group',
        'url': '/groups/group',
        'description': 'group description'
      };
    };
  });

  afterEach(function () {
    ACLGroupStore.getGroup = this.groupStore;
  });

  describe('#isOpen', function () {
    beforeEach(function () {
      this.params = {
        groupID: null
      };
      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <GroupSidePanel
          params={this.params}
          openedPage="settings-organization-groups" />,
        this.container
      );
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('should return false if all IDs are null', function () {
      expect(this.instance.isOpen()).toEqual(false);
    });

    it('should return true if new groupID received', function () {
      var prevGroupID = this.params.groupID;
      this.params.groupID = 'groupname';
      expect(this.instance.isOpen()).toEqual(true);
      this.params.groupID = prevGroupID;
    });
  });

  describe('#getContents', function () {
    beforeEach(function () {
      this.params = {
        groupID: null
      };
      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <GroupSidePanel
          statesProcessed={true}
          params={this.params} />,
        this.container
      );
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('should return GroupSidePanelContents if groupID is set',
      function () {
        this.params.groupID = 'set';
        var contents = this.instance.getContents(this.params.groupID);

        expect(contents.type.toString() === GroupSidePanelContents.toString()).toEqual(true);
        this.params.serviceName = null;
      }
    );

  });
});
