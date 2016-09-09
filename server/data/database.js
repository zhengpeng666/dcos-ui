const groups = require('./mock-data/groups.json');
const state = require('./mock-data/state.json');
const deploymentList = require('./mock-data/deployments.json');

const hostnames = {};
const services = {};
const deployments = {};
const tasks = {};

function reduceServices(group) {
  group.apps.forEach(app => {
    services[app.id] = app;
    mergeTasks(app.id, app.tasks);
  });
  group.groups.forEach(subGroup => reduceServices(subGroup));
};

function mergeTasks(serviceID, taskList) {
  taskList.forEach(task => {
    // Try to add hostname if slave_id exists
    if (task.slave_id) {
      task.hostname = hostnames[task.slave_id];
    }
    if (task.id in tasks) {
      tasks[task.id] = Object.assign({}, tasks[task.id], task);
    } else {
      tasks[task.id] = task;
    }
  });
}

reduceServices(groups);
deploymentList.forEach(deployment => deployments[deployment.id] = deployment);
state.slaves.forEach(slave => hostnames[slave.id] = slave.hostname);

state.frameworks.forEach(framework => mergeTasks(framework.name, framework.tasks));

function getService(id) {
  return services[id];
}

function getServices() {
  return Object.values(services);
}

function getTask(id) {
  return tasks[id];
}

function getTasks(serviceID) {
  return Object.values(tasks).filter(task => task.appId === serviceID);
}

function getCluster() {
  return {
    id: 'dcos-cluster-id'
  };
}

function getDeploymentsByIdSet(ids) {
  return ids.map(({id}) => deployments[id]);
}

export {
  getCluster,
  getService,
  getServices,
  getTask,
  getTasks,
  getDeploymentsByIdSet
};
