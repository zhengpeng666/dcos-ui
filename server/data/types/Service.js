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

import deploymentType from './Deployment';
import taskType from './Task';

import {
  getDeploymentsByIdSet,
  getTasks
} from '../database';

const { connectionType: taskConnection, edgeType: taskEdge } = connectionDefinitions({
  name: 'Task',
  nodeType: taskType
});

const { connectionType: deploymentConnection, edgeType: deploymentEdge } = connectionDefinitions({
  name: 'Deployment',
  nodeType: deploymentType
});


export default new GraphQLObjectType({
  name: 'Service',
  description: 'A Service in the cluster',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: "Id for Service",
      resolve: (service) => service.id
    },

    tasks: {
      type: taskConnection,
      description: 'Tasks that I have',
      args: connectionArgs,
      resolve: (service, args) => connectionFromArray(getTasks(service.id), args)
    },

    args: {
      type: new GraphQLList(GraphQLString),
      description: "Args for Service",
      resolve: (service) => service.args
    },

    cmd: {
      type: GraphQLString,
      description: "Run Command for Service",
      resolve: (service) => service.cmd
    },

    cpus: {
      type: GraphQLInt,
      description: "CPU allocation for Service",
      resolve: (service) => service.cpus
    },

    constraints: {
      type: new GraphQLList(GraphQLString),
      description: "Constraints for Service",
      resolve: (service) => service.constraints
    },

    deploymentsCount: {
      type: GraphQLInt,
      description: "Number of active deployments for Service",
      resolve: (service) => (service.deployments || []).length
    },

    deployments: {
      type: deploymentConnection,
      description: "Deployments for Service",
      args: connectionArgs,
      resolve: (service, args) => connectionFromArray(getDeploymentsByIdSet(service.deployments || []), args)
    },

    disk: {
      type: GraphQLInt,
      description: "Disk allocation for Service",
      resolve: (service) => service.disk
    },

    executor: {
      type: GraphQLString,
      description: "Executor for Service",
      resolve: (service) => service.executor
    },

    unMappedFields: {
      type: new GraphQLList(GraphQLString),
      description: 'Available shit that might not be mapped to this schema yet',
      resolve: (service) => Object.keys(service)
    }
  })
});

/*
    getAcceptedResourceRoles() {
      return this.get('acceptedResourceRoles');
    }

    getHealth() {
      let {tasksHealthy, tasksUnhealthy, tasksRunning} = this.getTasksSummary();

      if (tasksUnhealthy > 0) {
        return HealthStatus.UNHEALTHY;
      }

      if (tasksRunning > 0 && tasksHealthy === tasksRunning) {
        return HealthStatus.HEALTHY;
      }

      if (this.getHealthChecks() && tasksRunning === 0) {
        return HealthStatus.IDLE;
      }

      return HealthStatus.NA;
    }

    getHealthChecks() {
      return this.get('healthChecks');
    }

    getId() {
      return this.get('id') || '';
    }

    getImages() {
      return FrameworkUtil.getServiceImages(this.getMetadata().images);
    }

    getInstancesCount() {
      return this.get('instances');
    }

    getIpAddress() {
      return this.get('ipAddress');
    }

    getLabels() {
      return this.get('labels');
    }

    getLastConfigChange() {
      return this.getVersionInfo().lastConfigChangeAt;
    }

    getLastScaled() {
      return this.getVersionInfo().lastScalingAt;
    }

    getLastTaskFailure() {
      return this.get('lastTaskFailure');
    }

    getMem() {
      return this.get('mem');
    }

    getMetadata() {
      return FrameworkUtil.getMetadataFromLabels(this.getLabels());
    }

    getName() {
      return this.getId().split('/').pop();
    }

    getPorts() {
      return this.get('ports');
    }

    getPortDefinitions() {
      return this.get('portDefinitions');
    }

    getResources() {
      return {
        cpus: this.get('cpus'),
        mem: this.get('mem'),
        disk: this.get('disk')
      };
    }

    getResidency() {
      return this.get('residency');
    }

    getStatus() {
      const status = this.getServiceStatus();
      if (status.displayName == null) {
        return null;
      }

      return status.displayName;
    }

    getServiceStatus() {
      let {tasksRunning} = this.getTasksSummary();
      let deployments = this.getDeployments();
      let queue = this.getQueue();

      let instances = this.getInstancesCount();
      if (instances === 0 &&
        tasksRunning === 0
      ) {
        return ServiceStatus.SUSPENDED;
      }

      if (queue != null && queue.delay) {
        if (queue.delay.overdue) {
          return ServiceStatus.WAITING;
        }

        return ServiceStatus.DELAYED;
      }

      if (deployments != null && deployments.length > 0) {
        return ServiceStatus.DEPLOYING;
      }

      if (tasksRunning > 0) {
        return ServiceStatus.RUNNING;
      }

      return ServiceStatus.NA;
    }

    getTasksSummary() {
      let healthData = {
        tasksHealthy: this.get('tasksHealthy'),
        tasksStaged: this.get('tasksStaged'),
        tasksUnhealthy: this.get('tasksUnhealthy'),
        tasksUnknown: Math.max(0, this.get('tasksRunning') -
          this.get('tasksHealthy') - this.get('tasksUnhealthy'))
      };

      let tasksSum = Object.keys(healthData).reduce(function (sum, healthItem) {
        return sum + healthData[healthItem];
      }, 0);

      healthData.tasksOverCapacity =
        Math.max(0, tasksSum - this.getInstancesCount());

      healthData.tasksRunning = this.get('tasksRunning');
      return healthData;
    }

    getTaskStats() {
      return new TaskStats(this.get('taskStats'));
    }

    getFetch() {
      return this.get('fetch');
    }

    getQueue() {
      return this.get('queue');
    }

    getUpdateStrategy() {
      return this.get('updateStrategy');
    }

    getUser() {
      return this.get('user');
    }

    getVersion() {
      return this.get('version');
    }

    getVersions() {
      return this.get('versions') || new Map();
    }

    getVersionInfo() {
      let currentVersionID = this.get('version');
      let {lastConfigChangeAt, lastScalingAt} = this.get('versionInfo');

      return {lastConfigChangeAt, lastScalingAt, currentVersionID};
    }

    getVolumes() {
      return new VolumeList({items: this.get('volumes') || []});
    }

    getWebURL() {
      let {
        DCOS_SERVICE_NAME,
        DCOS_SERVICE_PORT_INDEX,
        DCOS_SERVICE_SCHEME
      } = this.getLabels() || {};

      let serviceName = encodeURIComponent(DCOS_SERVICE_NAME);

      if (!serviceName || !DCOS_SERVICE_PORT_INDEX || !DCOS_SERVICE_SCHEME) {
        return null;
      }

      return `${Config.rootUrl}/service/${serviceName}/`;

    }

 })
 */
