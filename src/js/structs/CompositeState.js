import _ from "underscore";
import deepExtend from "deep-extend";

import ServicesList from "./ServicesList";

let ids = {
  frameworks: [],
  slaves: []
};

let mergeData = function (newData, oldData) {
  // We use deepExtend to avoid mutating the original data.
  let mergedData = deepExtend({}, oldData);

  Object.keys(newData).forEach(function (key) {

    if (_.isArray(newData[key])) {
      // We need to merge the objects within the frameworks and slaves arrays
      // by finding matching IDs and merging the corresponding data.
      if (key === "frameworks" || key === "slaves") {
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

        // Merge the incoming data with what we currently have (if anything).
        mergedData[key] = activeIDs.map(function (id) {
          let oldObj = _.findWhere(oldData[key], {id: id});
          let newObj = _.findWhere(newData[key], {id: id});

          // These objects don't need to be deeply merged.
          return _.extend({}, oldObj, newObj);
        });

      } else {
        // We can replace any array that isn't frameworks or slaves.
        mergedData[key] = newData[key];
      }
    } else if (_.isObject(newData[key])) {
      let oldObj = oldData[key] || {};
      let newObj = newData[key];
      // We need to recurse over any nested objects.
      mergedData[key] = mergeData(newObj, oldObj);
    } else {
      // Any other type of value can be replaced.
      mergedData[key] = newData[key];
    }
  });

  return mergedData;
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
