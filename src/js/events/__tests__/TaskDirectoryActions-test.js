jest.dontMock('../TaskDirectoryActions');
jest.dontMock('../AppDispatcher');
jest.dontMock('../../config/Config');
jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../../utils/RequestUtil');

let TaskDirectoryActions = require('../TaskDirectoryActions');
let Config = require('../../config/Config');
let RequestUtil = require('../../utils/RequestUtil');

describe('TaskDirectoryActions', function () {

  beforeEach(function () {
    this.configuration = null;
    this.requestUtilJSON = RequestUtil.json;
    RequestUtil.json = function (configuration) {
      this.configuration = configuration;
    }.bind(this);
    Config.rootUrl = '';
    Config.useFixtures = false;
  });

  afterEach(function () {
    RequestUtil.json = this.requestUtilJSON;
  });

  describe('#getInnerPath', function () {

    it('finds path of a running task', function () {
      var result = TaskDirectoryActions.getInnerPath(
        {frameworks: [{id: 'foo', executors: [{id: 'bar'}]}]},
        {framework_id: 'foo', id: 'bar'}
      );

      expect(result).toBeTruthy();
    });

    it('finds path of a completed task', function () {
      var result = TaskDirectoryActions.getInnerPath(
        {completed_frameworks: [{id: 'foo', completed_executors: [{id: 'bar'}]}]},
        {framework_id: 'foo', id: 'bar'}
      );

      expect(result).toBeTruthy();
    });

    it('finds path of a task in completed executors', function () {
      var result = TaskDirectoryActions.getInnerPath(
        {frameworks: [{id: 'foo', completed_executors: [{id: 'bar'}]}]},
        {framework_id: 'foo', id: 'bar'}
      );

      expect(result).toBeTruthy();
    });

    it('finds path of a task in completed frameworks', function () {
      var result = TaskDirectoryActions.getInnerPath(
        {completed_frameworks: [{id: 'foo', executors: [{id: 'bar'}]}]},
        {framework_id: 'foo', id: 'bar'}
      );

      expect(result).toBeTruthy();
    });

    it('finds path of a completed task', function () {
      var result = TaskDirectoryActions.getInnerPath(
        {completed_frameworks: [{id: 'foo', completed_executors: [{id: 'bar'}]}]},
        {framework_id: 'foo', id: 'bar'}
      );

      expect(result).toBeTruthy();
    });

  });

});
