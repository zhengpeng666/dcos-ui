import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

export default new GraphQLObjectType({
  name: 'Task',
  description: 'A Service\'s task',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: "Id for Task"
    },
    name: {
      type: GraphQLString,
      description: 'Tasks\'s name'
    },
    hostname: {
      type: GraphQLString,
      description: 'Tasks\'s hostname (from Node in Mesos)'
    },
    state: {
      type: GraphQLString,
      description: 'Tasks\'s state'
    }
  })
});
