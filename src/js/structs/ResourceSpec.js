import DataObject from './primitive/DataObject';

class ResourceSpec extends DataObject {

  constructor() {
    super(...arguments);

    // Create accessors to the following object properties, exposed as object
    // properties in the instance with the given `as` name:

    this.createAccessorFor('cpus')
      .as('cpus');

    this.createAccessorFor('mem')
      .as('mem');

    this.createAccessorFor('disk')
      .as('disk');

    this.createAccessorFor('gpu')
      .as('gpu');
  }

}

module.exports = ResourceSpec;
