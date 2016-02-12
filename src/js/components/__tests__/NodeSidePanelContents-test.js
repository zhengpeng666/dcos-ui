jest.dontMock('../charts/Chart');
jest.dontMock('../SidePanelContents');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../mixins/InternalStorageMixin');
jest.dontMock('../../mixins/TabsMixin');
jest.dontMock('../../stores/MesosSummaryStore');
jest.dontMock('../../events/MesosSummaryActions');
jest.dontMock('../../utils/MesosSummaryUtil');
jest.dontMock('../NodeSidePanelContents');
jest.dontMock('../TaskTable');
jest.dontMock('../TaskView');
jest.dontMock('../RequestErrorMsg');
jest.dontMock('../../utils/Util');
jest.dontMock('../../utils/JestUtil');

require('../../utils/StoreMixinConfig');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var JestUtil = require('../../utils/JestUtil');
var MesosStateStore = require('../../stores/MesosStateStore');
var MesosSummaryActions = require('../../events/MesosSummaryActions');
var MesosSummaryStore = require('../../stores/MesosSummaryStore');
var NodeSidePanelContents = require('../NodeSidePanelContents');

describe('NodeSidePanelContents', function () {
  beforeEach(function () {
    this.fetchSummary = MesosSummaryActions.fetchSummary;
    this.getTasksFromNodeID = MesosStateStore.getTasksFromNodeID;
    this.storeGet = MesosStateStore.get;
    this.storeGetNode = MesosStateStore.getNodeFromID;

    MesosSummaryActions.fetchSummary = function () {
      return null;
    };
    MesosStateStore.getTasksFromNodeID = function () {
      return [];
    };

    MesosStateStore.get = function (key) {
      if (key === 'lastMesosState') {
        return {
          version: '1'
        };
      }

    };

    MesosStateStore.getNodeFromID = function (id) {
      if (id === 'nonExistent') {
        return null;
      }

      return {
        id: 'existingNode',
        version: '10',
        active: true,
        registered_time: 10
      };
    };
    MesosSummaryStore.init();
    MesosSummaryStore.processSummary({
      slaves: [
        {
          'id': 'foo',
          'hostname': 'bar'
        },
        {
          id: 'existingNode',
          version: '10',
          active: true,
          registered_time: 10,
          sumTaskTypesByState: function () { return 1; }
        }
      ]
    });
  });

  afterEach(function () {
    MesosSummaryActions.fetchSummary = this.fetchSummary;
    MesosStateStore.getTasksFromNodeID = this.getTasksFromNodeID;
    MesosStateStore.get = this.storeGet;
    MesosStateStore.getNodeFromID = this.storeGetNode;
  });

  describe('#renderDetailsTabView', function () {

    it('should return null if node does not exist', function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="nonExistent" />
      );

      var result = instance.renderDetailsTabView();
      expect(result).toEqual(null);
    });

    it('should return a node if node exists', function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="existingNode" />
      );

      var result = instance.renderDetailsTabView();
      expect(TestUtils.isElement(result)).toEqual(true);
    });
  });

  describe('#getKeyValuePairs', function () {

    it('should return an empty set if node does not exist', function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="nonExistent" />
      );

      var result = instance.getKeyValuePairs({});
      expect(result).toEqual(null);
    });

    it('should return null if undefined is passed', function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="nonExistent" />
      );

      var result = instance.getKeyValuePairs();
      expect(result).toEqual(null);
    });

    it('should return a node of elements if node exists', function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="existingNode" />
      );

      var result = instance.getKeyValuePairs({'foo': 'bar'});
      expect(TestUtils.isElement(result)).toEqual(true);
    });

    it('should return a headline if headline string is given', function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="existingNode" />
      );

      var headlineInstance = TestUtils.renderIntoDocument(
        instance.getKeyValuePairs({'foo': 'bar'}, 'baz')
      );

      var node = ReactDOM.findDOMNode(headlineInstance);
      var headline = node.querySelector('h6');

      expect(TestUtils.isDOMComponent(headline)).toEqual(true);
    });
  });

  describe('#render', function () {
    it('should show error if node is not to be found', function () {
      var instance = TestUtils.renderIntoDocument(
        <NodeSidePanelContents itemID="nonExistent" />
      );

      var headline = TestUtils.findRenderedDOMComponentWithTag(instance, 'h3');
      expect(ReactDOM.findDOMNode(headline).textContent).toBe('Error finding node');
    });
  });
});
