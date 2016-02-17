jest.dontMock('../ComponentHealthStore');
jest.dontMock('../../config/Config');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/ComponentHealthActions');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../../../tests/_fixtures/component-health/components.json');

var _ = require('underscore');
var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../events/AppDispatcher');
var ComponentHealthStore = require('../ComponentHealthStore');
var Config = require('../../config/Config');
var EventTypes = require('../../constants/EventTypes');
var componentsFixture = require('../../../../tests/_fixtures/component-health/components.json');
var HealthComponentList = require('../../structs/HealthComponentList');
var RequestUtil = require('../../utils/RequestUtil');

describe('ComponentHealthStore', function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = function (handlers) {
      handlers.success(componentsFixture);
    };
    this.componentsFixture = _.clone(componentsFixture);
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  it('should return an instance of HealthComponentList', function () {
    Config.useFixtures = true;
    ComponentHealthStore.fetchComponents();
    var components = ComponentHealthStore.get('components');
    expect(components instanceof HealthComponentList).toBeTruthy();
  });

  it('should return all of the components it was given', function () {
    Config.useFixtures = true;
    ComponentHealthStore.fetchComponents();
    var components = ComponentHealthStore.get('components').getItems();
    expect(components.length).toEqual(this.componentsFixture.array.length);
  });

  describe('dispatcher', function () {

    it('stores components when event is dispatched', function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_HEALTH_COMPONENTS_SUCCESS,
        data: [
          {
            'id': 'mesos',
            'name': 'Mesos',
            'version': '0.27.1',
            'health': 3
          }
        ]
      });

      var components = ComponentHealthStore.get('components').getItems();
      expect(components[0].id).toEqual('mesos');
      expect(components[0].name).toEqual('Mesos');
    });

    it('dispatches the correct event upon success', function () {
      var mockedFn = jest.genMockFunction();
      ComponentHealthStore.addChangeListener(EventTypes.HEALTH_COMPONENTS_CHANGE, mockedFn);
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_HEALTH_COMPONENTS_SUCCESS,
        data: []
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

    it('dispatches the correct event upon error', function () {
      var mockedFn = jasmine.createSpy();
      ComponentHealthStore.addChangeListener(
        EventTypes.HEALTH_COMPONENTS_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_HEALTH_COMPONENTS_ERROR,
        data: 'foo'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo']);
    });

  });
});
