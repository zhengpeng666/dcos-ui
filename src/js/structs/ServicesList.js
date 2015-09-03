let MesosSummaryUtil = require("../utils/MesosSummaryUtil");
let StringUtil = require("../utils/StringUtil");
let List = require("./List");

export default class ServicesList extends List {

  filter(filters) {
    var services = this.getItems();

    if (filters) {
      if (filters.health != null) {
        services = MesosSummaryUtil.filterServicesByHealth(
          services, filters.health
        );
      }

      if (filters.name) {
        services = StringUtil.filterByString(services, "name", filters.name);
      }
    }

    return services;
  }

}
