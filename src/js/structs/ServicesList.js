const _ = require("underscore");

let MesosSummaryUtil = require("../utils/MesosSummaryUtil");
let StringUtil = require("../utils/StringUtil");
let List = require("./List");

export default class ServicesList extends List {

  filter(filters) {
    let services = this.getItems();

    if (filters) {
      if (filters.health != null) {
        services = MesosSummaryUtil.filterServicesByHealth(
          services, filters.health
        );
      }

      if (filters.name) {
        services = StringUtil.filterByString(services, "name", filters.name);
      }

      if (filters.ids) {
        services = _.filter(services, function (service) {
          return this.ids.indexOf(service.id) !== -1;
        }, {ids: filters.ids});
      }
    }

    return new ServicesList({items: services});
  }

  sumUsedResources() {
    let services = this.getItems();
    let resourcesList = _.pluck(services, "used_resources");
    return MesosSummaryUtil.sumResources(resourcesList);
  }

}
