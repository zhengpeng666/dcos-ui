const _ = require("underscore");

let List = require("./List");
let MesosSummaryUtil = require("../utils/MesosSummaryUtil");
let Node = require("./Node");
let StringUtil = require("../utils/StringUtil");

export default class NodesList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of Node
    this.list = this.list.map(function (item) {
      if (item instanceof Node) {
        return item;
      } else {
        return new Node(item);
      }
    });
  }

  filter(filters) {
    let hosts = this.getItems();

    if (filters) {
      if (filters.ids) {
        hosts = _.filter(hosts, function (host) {
          return this.ids.indexOf(host.id) !== -1;
        }, {ids: filters.ids});
      }

      if (filters.name) {
        hosts = StringUtil.filterByString(hosts, "hostname", filters.name);
      }

      if (filters.service != null) {
        hosts = MesosSummaryUtil.filterHostsByService(hosts, filters.service);
      }
    }

    return new NodesList({items: hosts});
  }

  sumUsedResources() {
    let services = this.getItems();
    let resourcesList = _.pluck(services, "used_resources");
    return MesosSummaryUtil.sumResources(resourcesList);
  }
}
