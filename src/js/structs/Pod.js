import DataObject from './primitive/DataObject';

class Pod extends DataObject {

  constructor() {
    super(...arguments);

    // Pod Name
    this.createAccessorFor('name')
        .as('name');

  }

}

module.exports = Pod;
