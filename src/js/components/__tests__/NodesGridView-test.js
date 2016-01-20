jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../mixins/InternalStorageMixin');
jest.dontMock('../NodesGridView');
jest.dontMock('../../stores/MesosStateStore');
jest.dontMock('../../utils/Util');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var NodesGridView = require('../NodesGridView');
var MesosStateStore = require('../../stores/MesosStateStore');
var NodesList = require('../../structs/NodesList');

MesosStateStore.addChangeListener = function () {};

describe('NodesGridView', function () {

  describe('#getActiveServiceIds', function () {

    beforeEach(function () {
      MesosStateStore.processStateSuccess({frameworks: []});
      this.hosts = new NodesList({items: [
        {
          name: 'foo',
          framework_ids: [
            'a',
            'b',
            'c'
          ]
        },
        {
          name: 'bar',
          framework_ids: [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f'
          ]
        },
        {
          name: 'zoo',
          framework_ids: [
            'a',
            'd',
            'g',
            'z'
          ]
        }
      ]});

      this.instance = TestUtils.renderIntoDocument(
        <NodesGridView
          selectedResource={'mem'}
          hosts={this.hosts.getItems()}
          services={[]}
          />
      );
    });

    it('should return a list of unique framwork_ids', function () {
      var list = this.instance.getActiveServiceIds(this.hosts.getItems());

      expect(list).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'z']);
    });

  });

});
