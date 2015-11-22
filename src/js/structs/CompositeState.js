import _ from "underscore";
import deepExtend from "deep-extend";

import ServicesList from "./ServicesList";

let ids = {
  frameworks: [],
  slaves: []
};

let mergeData = function (newData, oldData) {
  // We use deep-extend to avoid mutating the old data.
  let mergedData = deepExtend({}, oldData);

  Object.keys(newData).forEach(function (key) {
    if (_.isArray(newData[key])) {
      mergedData[key] = mergeMesosArrays(newData, oldData, key);
    } else if (_.isObject(newData[key])) {
      // We need to recurse over any nested objects.
      mergedData[key] = mergeData(newData[key], oldData[key] || {});
    } else {
      // Any other type of value can be replaced.
      mergedData[key] = newData[key];
    }
  });

  return mergedData;
};

let mergeMesosArrays = function (newData, oldData, key) {
  if (key === "frameworks" || key === "slaves") {
    // We need to merge the objects within the frameworks and slaves arrays.
    return mergeById(newData, oldData, key);
  } else {
    // We can replace any other array.
    return newData[key];
  }
};

let mergeById = function (newData, oldData, key) {
  let activeIDs = _.pluck(newData[key], "id");
  let idsToRemove = _.difference(ids[key], activeIDs);
  let idsToAdd = _.difference(activeIDs, ids[key]);

  // Remove any IDs that we didn't receive new data for.
  idsToRemove.forEach(function (id) {
    let idIndexToRemove = ids[key].indexOf(id);
    ids[key].splice(idIndexToRemove, 1);
  });

  // Add IDs that we didn't have data for previously.
  ids[key] = ids[key].concat(idsToAdd);

  // Merge the incoming data with the old data.
  return activeIDs.map(function (id) {
    let oldObj = _.findWhere(oldData[key], {id: id});
    let newObj = _.findWhere(newData[key], {id: id});

    // These objects don't need to be deeply merged.
    return _.extend({}, oldObj, newObj);
  });
};

export default class CompositeState {
  constructor(data = {}) {
    this.data = data;
  }

  addMarathon(data) {
    if (Object.keys(this.data).length === 0) {
      return;
    }

    this.data.frameworks.forEach(function (service) {
      if (data[service.id]) {
        service._meta = {
          marathon: data[service.id]
        };
      }
    });
  }

  addState(data) {
    this.data = mergeData(data, this.data);
  }

  addSummary(data) {
    this.data = mergeData(data, this.data);
  }

  getServiceList() {
    return new ServicesList({
      items: this.data.frameworks
    });
  }
}
