import ContainerStatus from './ContainerStatus';
import DataObject from './primitive/DataObject';
import List from './primitive/List';
import PodInstanceStatus from './PodInstanceStatus';

class PodStatus extends DataObject {

  constructor() {
    super(...arguments);

    // Create accessors to the following object properties, exposed as object
    // properties in the instance with the given `as` name:

    this.createAccessorFor('instances')
      .wrapArrayItemsWith(ContainerStatus)
      .wrappedWith(List)
      .as('instances');

  }

}

module.exports = PodStatus;
