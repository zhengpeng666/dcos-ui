jest.dontMock('../../actions/Actions');
jest.dontMock('../ActionsMixin');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('Tracking', {enabled: true});
require('../../SDK').setSDK(SDK);

var _ = require('underscore');

var Actions = require('../../actions/Actions');
var ActionsMixin = require('../ActionsMixin');

global.analytics = {
  initialized: true,
  page: _.noop,
  track: _.noop
};

describe('ActionsMixin', function () {

  describe('#componentDidMount', function () {

    beforeEach(function () {
      this.instance = _.extend({}, ActionsMixin);
      this.instance.constructor.displayName = 'FakeInstance';

      this.instance.actions_registerComponent = jasmine.createSpy();
      this.instance.actions_monkeyPatch = jasmine.createSpy();
    });

    it('does not regsiter component', function () {
      this.instance.actions_configuration = {};
      this.instance.actions_configuration.disable = true;

      this.instance.componentDidMount();
      expect(this.instance.actions_registerComponent).not.toHaveBeenCalled();
    });

    it('does not monkey patch component', function () {
      this.instance.actions_configuration = {};
      this.instance.actions_configuration.disable = true;

      this.instance.componentDidMount();
      expect(this.instance.actions_monkeyPatch).not.toHaveBeenCalled();
    });

    it('does regsiter component', function () {
      this.instance.componentDidMount();
      expect(this.instance.actions_registerComponent).toHaveBeenCalled();
    });

    it('does monkey patch component', function () {
      this.instance.componentDidMount();
      expect(this.instance.actions_monkeyPatch).toHaveBeenCalled();
    });

  });

  describe('#componentWillUnmount', function () {

    beforeEach(function () {
      Actions.__registerComponent_bak = Actions.registerComponent;
      Actions.registerComponent = jasmine.createSpy();
      Actions.__deregisterComponent_bak = Actions.deregisterComponent;
      Actions.deregisterComponent = jasmine.createSpy();

      this.instance = _.extend({}, ActionsMixin);
      this.instance.constructor.displayName = 'FakeInstance';
      this.instance.componentDidMount();
    });

    afterEach(function () {
      Actions.registerComponent = Actions.__registerComponent_bak;
      Actions.deregisterComponent = Actions.__deregisterComponent_bak;
    });

    it('deregisters component', function () {
      this.instance.componentWillUnmount();
      expect(Actions.deregisterComponent).toHaveBeenCalled();
    });

    it('deregisters component with correct component id', function () {
      this.instance.componentWillUnmount();
      var id = this.instance.actions_componentID;
      expect(Actions.deregisterComponent.calls[0].args[0]).toEqual(id);
    });

  });

  describe('#actions_registerComponent', function () {

    beforeEach(function () {
      Actions.__registerComponent_bak = Actions.registerComponent;
      Actions.registerComponent = jasmine.createSpy();

      this.instance = _.extend({}, ActionsMixin);
      this.instance.constructor.displayName = 'FakeInstance';
      this.instance.actions_registerComponent();
    });

    afterEach(function () {
      Actions.registerComponent = Actions.__registerComponent_bak;
    });

    it('creates a component id', function () {
      expect(this.instance.actions_componentID).toBeDefined();
    });

    it('calls Actions#registerComponent', function () {
      expect(Actions.registerComponent).toHaveBeenCalled();
    });

    it('calls Actions#registerComponent with correct arguments', function () {
      expect(Actions.registerComponent.calls[0].args).toEqual([{
        id: this.instance.actions_componentID,
        path: this.instance.__rootNodeID,
        componentName: this.instance.constructor.displayName,
        instance: this.instance
      }]);
    });

  });

  describe('#actions_monkeyPatch', function () {

    beforeEach(function () {
      this.instance = _.extend({
        setState: jasmine.createSpy(),
        state: {}
      }, ActionsMixin);
      this.instance.constructor.displayName = 'FakeInstance';
    });

    it('replaces #setState with a function', function () {
      this.instance.actions_monkeyPatch();
      expect(typeof this.instance.setState).toEqual('function');
    });

    it('replaces #setState with a proxy function', function () {
      var setStateFn = this.instance.setState;
      this.instance.actions_monkeyPatch();
      expect(this.instance.setState).not.toEqual(setStateFn);
    });

    it('calls the original #setState', function () {
      var setStateFn = this.instance.setState;
      this.instance.actions_monkeyPatch();
      this.instance.setState({foo: 'bar'});

      expect(setStateFn).toHaveBeenCalled();
    });

    it('calls the original #setState with new state', function () {
      var setStateFn = this.instance.setState;
      this.instance.actions_monkeyPatch();
      this.instance.setState({foo: 'bar'});

      expect(setStateFn.calls[0].args[0]).toEqual({foo: 'bar'});
    });

  });

  describe('#actions_setStateProxy', function () {

    beforeEach(function () {
      this.instance = _.extend({
        setState: jasmine.createSpy(),
        state: {}
      }, ActionsMixin);
      this.instance.constructor.displayName = 'FakeInstance';

      this.originalSetState = this.instance.setState;
      this.instance.actions_monkeyPatch();
    });

    it('calls original setState with all arguments', function () {
      this.instance.setState('foo', {bar: 'baz'});
      expect(this.originalSetState.calls[0].args).toEqual([
        'foo', {bar: 'baz'}
      ]);
    });

    it('calculates diff from previous state to be logged', function () {
      this.instance.actions_processState = jasmine.createSpy();
      this.instance.state = {foo: 'bar', bar: 'qux'};
      this.instance.setState({bar: 'baz'});
      expect(this.instance.actions_processState.calls[0].args[0]).toEqual({
        bar: 'baz'
      });
    });

  });

  describe('#actions_getStateConfiguration', function () {

    beforeEach(function () {
      this.instance = _.extend({}, ActionsMixin);
    });

    it('returns empty hash if no action state config is defined', function () {
      var config = this.instance.actions_getStateConfiguration();
      expect(config).toEqual({});
    });

    it('returns state configuration when defined', function () {
      this.instance.actions_configuration = {
        state: {
          foo: 'bar',
          baz: 'qux'
        }
      };
      var config = this.instance.actions_getStateConfiguration();
      expect(config).toEqual({foo: 'bar', baz: 'qux'});
    });

  });

  describe('#actions_getStateConfigurationForKey', function () {

    beforeEach(function () {
      this.instance = _.extend({
        actions_configuration: {
          state: {
            foo: 'bar'
          }
        }
      }, ActionsMixin);
    });

    it('returns undefined if state property config is not defined',
      function () {
      var config = this.instance.actions_getStateConfigurationForKey('baz');
      expect(config).toEqual(undefined);
    });

    it('returns value if state property config is defined', function () {
      var config = this.instance.actions_getStateConfigurationForKey('foo');
      expect(config).toEqual('bar');
    });

  });

  describe('#actions_processState', function () {

    beforeEach(function () {
      this.instance = _.extend({}, ActionsMixin);
      this.instance.constructor.displayName = 'FakeInstance';

      Actions._logBatchAction_bak = Actions.logBatchAction;
      spyOn(Actions, 'logBatchAction');
    });

    afterEach(function () {
      Actions.logBatchAction = Actions._logBatchAction_bak;
    });

    it('does not call Actions#logBatchAction', function () {
      this.instance.actions_processState({});
      expect(Actions.logBatchAction).not.toHaveBeenCalled();
    });

    it('calls Actions#logBatchAction', function () {
      this.instance.actions_processState({foo: 'bar'});
      expect(Actions.logBatchAction).toHaveBeenCalled();
    });

    it('calls Actions#logBatchAction with single message', function () {
      this.instance.actions_processState({foo: 'bar'});
      expect(Actions.logBatchAction.calls[0].args[0]).toEqual([
        [this.instance.constructor.displayName, 'foo']
      ]);
    });

    it('calls Actions#logBatchAction with multiple messages', function () {
      this.instance.actions_processState({foo: 'bar', baz: 'qux'});
      expect(Actions.logBatchAction.calls[0].args[0]).toEqual([
        [this.instance.constructor.displayName, 'foo'],
        [this.instance.constructor.displayName, 'baz']
      ]);
    });

    it('calls Actions#logBatchAction with custom message', function () {
      this.instance.actions_configuration = {};
      this.instance.actions_configuration.state = {
        foo: function () {
          return 'baz';
        }
      };

      this.instance.actions_processState({foo: 'bar'});
      expect(Actions.logBatchAction.calls[0].args[0]).toEqual([
        [this.instance.constructor.displayName, 'foo', 'baz']
      ]);
    });

    it('skips state key', function () {
      this.instance.actions_configuration = {};
      this.instance.actions_configuration.state = {
        foo: {skip: true}
      };

      this.instance.actions_processState({foo: 'bar'});
      expect(Actions.logBatchAction).not.toHaveBeenCalled();
    });

  });

});
