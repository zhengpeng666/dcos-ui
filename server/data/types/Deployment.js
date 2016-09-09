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
  name: 'Deployment',
  description: 'A Service deployment',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: "Id for Deployment",
      resolve: (deployment) =>  deployment.id
    },
    version: {
      type: GraphQLString,
      description: "Version for Deployment",
      resolve: (deployment) =>  deployment.version
    },
    currentStep: {
      type: GraphQLInt,
      description: "Current Step of Deployment",
      resolve: (deployment) =>  deployment.currentStep
    }
  })
});
