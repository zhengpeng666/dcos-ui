import DataObject from './primitive/DataObject';

class ContainerStatus extends DataObject {

  constructor() {
    super(...arguments);

    // Create accessors to the following object properties, exposed as object
    // properties in the instance with the given `as` name:

    this.createAccessorFor('name')
      .as('name');

    this.createAccessorFor('state')
      .as('state');

    this.createAccessorFor('resources')
      .as('resources');

    this.createAccessorFor('statusMessage')
      .as('statusMessage');

    this.createAccessorFor('taskID')
      .as('taskID');

    this.createAccessorFor('lastTerminalState')
      .as('lastTerminalState');

    this.createAccessorFor('restartCount')
      .as('restartCount');

  }

}

module.exports = ContainerStatus;
