const ReducerUtil = require('../ReducerUtil');

const idReducer = function (state = '', action) {
  if (action.path.join('') === 'id') {
    state = action.value;
  }
  return state;
};
describe('ReducerUtil', function () {
  describe('#combineReducers', function () {

    beforeEach(function () {

      this.items = [
        {
          path: ['id'],
          value: 'foo'
        }
      ];
      this.reducers = ReducerUtil.combineReducers(
        {
          id: idReducer
        }
      );
    });

    it('should return a function', function () {
      expect(typeof ReducerUtil.combineReducers()).toBe('function');
    });

    it('should work with a simple reducer object', function () {
      const state = this.items.reduce(this.reducers, {});

      expect(state).toEqual({id: 'foo'});
    });

    it('should not remove exisiting values', function () {
      const state = this.items.reduce(this.reducers, {bar: 'bar'});

      expect(state).toEqual({id: 'foo', bar: 'bar'});
    });

    it('should use context', function () {
      const reducers = ReducerUtil.combineReducers({
        id: idReducer,
        vip(state = undefined, action) {
          if (action.path.join('') === 'id') {
            this.id = action.value;
          }

          if (action.path.join('') === 'port') {
            this.port = action.value;
          }

          if (this.id && this.port) {
            return `${this.id}:${this.port}`;
          }
          return state;
        }

      });
      let array = [
        {
          path: ['id'],
          value: 'foo'
        },
        {
          path: ['port'],
          value: '8080'
        }
      ];

      const state = array.reduce(reducers, {});

      array = [
        {
          path: ['id'],
          value: 'bar'
        }
      ];

      const secondState = array.reduce(reducers, {});

      expect([state, secondState])
        .toEqual([{id: 'foo', vip: 'foo:8080'}, {id: 'bar', vip: undefined}]);
    });

    it('should properly apply a set of user actions', function () {
      let dockerReduce = ReducerUtil.combineReducers({
        id(state = undefined, action) {
          if (action.action === 'SET' &&
            action.path.join('.') === 'container.docker') {
            return action.value;
          }
          return state;
        }
      });

      let reducers = ReducerUtil.combineReducers({
        id(state = '', action) {
          if (action.action === 'SET' &&
            action.path.join('') === 'id') {
            state = action.value;
          }
          return state;
        },
        cmd(state = undefined, action) {
          if (action.action === 'SET' &&
            action.path.join('') === 'cmd') {
            state = action.value;
          }
          return state;
        },
        container: ReducerUtil.combineReducers({
          docker(state = undefined, action) {
            if (action.action === 'SET' &&
              action.path.join('.') === 'container.docker') {
              return dockerReduce(state, action);
            }

            return state;
          }
        })
      });

      let state = {};

      let actions = [
        {
          action: 'SET',
          path: ['id'],
          value: 'foo'
        },
        {
          action: 'SET',
          path: ['cmd'],
          value: 'sleep 100;'
        },
        {
          action: 'SET',
          path: ['container', 'docker'],
          value: 'nginx'
        }
      ];

      state = actions.reduce(
        function (state, action) {
          state = reducers(state, action);
          return state;
        }, state
      );

      expect(state).toEqual(
        {
          id: 'foo',
          cmd: 'sleep 100;',
          container: {docker: {id: 'nginx'}}
        }
      );
    });
    it('test', function () {
      let state = {
        id: '/abc',
        container: {
          docker: {
            id: 'nginx'
          }
        },
        cmd: 'sleep 100'
      };

      let errorReducer = ReducerUtil.combineReducers({
        id: function(state = null) {
          if (/\/.*/g.test(state)) {
            return null;
          }
          return 'Error';
        },
        docker: ReducerUtil.combineReducers({
          type: function(state) {
            if (state == null) {
              return 'ERROR';
            }
          },
          container: ReducerUtil.combineReducers({
            id: function(state) {
              if (state == null) {
                return 'ERROR';
              }
            }
          })
        }),
        cmd: function(state = null) {
          if (state != null) {
            return null;
          }
          return 'Error';
        }
      });

      console.log(errorReducer(state));
    });
  });
});

