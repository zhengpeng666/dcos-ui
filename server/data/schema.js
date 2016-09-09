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

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection
} from 'graphql-relay';

import {
  getCluster,
  getService,
  getServices,
  getTask,
  getTasks
} from './database';

import serviceType from './types/Service';

/**
 * Define types
 */

const clusterType = new GraphQLObjectType({
  name: 'Cluster',
  description: 'The cluster',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: "Id for Service"
    },
    meta: {
      type: clusterMetaType,
      resolve: () => getCluster()
    },
    services: {
      type: serviceConnection,
      description: 'Services in the cluster',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getServices(), args)
    }
  })
});

const clusterMetaType = new GraphQLObjectType({
  name: 'ClusterMeta',
  description: 'The cluster\'s metadata',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: 'ID for Cluster',
      resolve: (cluster) => cluster.id
    }
  })
});

/**
 * Define connection types
 */
const { connectionType: serviceConnection, edgeType: serviceEdge } = connectionDefinitions({
  name: 'Service',
  nodeType: serviceType
});


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    // Add your own root fields here
    cluster: {
      type: clusterType,
      resolve: () => getCluster()
    },
    service: {
      type: serviceType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: (_, {id}) => getService(id)
    }
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export default new GraphQLSchema({
  query: queryType
});
