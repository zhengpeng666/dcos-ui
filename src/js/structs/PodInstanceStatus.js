import DataObject from './primitive/DataObject';
import ResourceSpec from './ResourceSpec';

class PodInstanceStatus extends DataObject {

  constructor() {
    super(...arguments);

    // Create accessors to the following object properties, exposed as object
    // properties in the instance with the given `as` name:

    this.createAccessorFor('instanceID')
      .as('id');

    this.createAccessorFor('resources')
      .wrappedWith(ResourceSpec)
      .as('resources');

    this.createAccessorFor('containers')
      .wrapArrayItemsWith(Blah)
      .wrappedWith(List)
      .as('containers');

  }

}

module.exports = PodInstanceStatus;
