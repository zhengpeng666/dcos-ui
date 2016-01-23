import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLDirectoriesStore from '../../stores/ACLDirectoriesStore';
import FormModal from '../../components/FormModal';

const buttonDefinition = [
  {
    text: 'Close',
    className: 'button button-medium',
    isClose: true
  },
  {
    text: 'Add',
    className: 'button button-success button-medium',
    isSubmit: true
  }
];

const fieldDefinitions = {
  host: 'Host',
  port: 'Port',
  dntemplate: 'Distinguished Name template',
  'use-ldaps': 'Use SSL/TLS socket',
  'enforce-starttls': 'Enforce StartTLS'
};

const METHODS_TO_BIND = [
  'changeModalOpenState',
  'handleModalSubmit'
];

class DirectoriesTab extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.state = {
      modalDisabled: false,
      modalOpen: false
    };

    this.store_listeners = [
      {
        name: 'aclDirectories',
        events: ['fetchSuccess', 'addSuccess', 'addError', 'deleteSuccess']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    ACLDirectoriesStore.fetchDirectories();
  }

  onAclDirectoriesStoreAddSuccess() {
    this.changeModalOpenState(false);
    ACLDirectoriesStore.fetchDirectories();
  }

  onAclDirectoriesStoreAddError() {
    this.setState({modalDisabled: false});
  }

  handleModalSubmit(formData) {
    formData['enforce-starttls'] = !!formData['enforce-starttls'][0].checked;
    formData['use-ldaps'] = !!formData['use-ldaps'][0].checked;

    ACLDirectoriesStore.addDirectory(formData);
    this.setState({modalDisabled: true});
  }

  handleDirectoryDelete() {
    ACLDirectoriesStore.deleteDirectory();
  }

  changeModalOpenState(open) {
    this.setState({modalOpen: open, modalDisabled: false});
  }

  getModalFormDefinition() {
    return [
      {
        fieldType: 'text',
        name: 'host',
        placeholder: fieldDefinitions.host,
        required: true,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      },
      {
        fieldType: 'text',
        name: 'port',
        placeholder: fieldDefinitions.port,
        required: true,
        validationErrorText: 'Value should be numerical',
        showLabel: false,
        writeType: 'input',
        validation: /^[0-9]+$/,
        value: ''
      },
      {
        fieldType: 'text',
        name: 'dntemplate',
        placeholder: fieldDefinitions.dntemplate,
        required: true,
        validationErrorText:
          'Value must contain username placeholder "%(username)s"',
        showLabel: false,
        writeType: 'input',
        validation: /\%\(username\)s/,
        value: ''
      },
      {
        fieldType: 'checkbox',
        name: 'use-ldaps',
        required: false,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: [
          {
            name: 'use-ldaps-checkbox',
            label: fieldDefinitions['use-ldaps']
          }
        ]
      },
      {
        fieldType: 'checkbox',
        name: 'enforce-starttls',
        required: false,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: [
          {
            name: 'enforce-starttls-checkbox',
            label: fieldDefinitions['enforce-starttls']
          }
        ]
      }
    ];
  }

  renderDirectory(directory) {
    let fields = Object.keys(fieldDefinitions).map(function (key) {
      let value = directory[key];

      if (value === true) {
        value = 'Yes';
      } else if (value === false) {
        value = 'No';
      }

      return (
        <dl key={key} className="flex-box row">
          <dt className="column-3 emphasize inverse">
            {fieldDefinitions[key]}
          </dt>
          <dd className="column-9 inverse">
            {value}
          </dd>
        </dl>
      );
    });

    return (
      <div>
        <h4 className="inverse flush-top">External LDAP</h4>
        {fields}
        <button
          className="button button-danger"
          onClick={this.handleDirectoryDelete}>
          Delete Directory
        </button>
      </div>
    );
  }

  renderAddDirectory() {
    return (
      <div>
        <button
          className="button button-success"
          onClick={this.changeModalOpenState.bind(null, true)}>
          + Add Directory
        </button>
        <FormModal
          buttonDefinition={buttonDefinition}
          definition={this.getModalFormDefinition()}
          disabled={this.state.modalDisabled}
          onClose={this.changeModalOpenState.bind(null, false)}
          onSubmit={this.handleModalSubmit}
          open={this.state.modalOpen}>
          <h2 className="modal-header-title text-align-center flush-top">
            Add External Directory
          </h2>
        </FormModal>
      </div>
    );
  }

  render() {
    let directories = ACLDirectoriesStore.get('directories');
    if (directories) {
      return this.renderDirectory(directories.getItems()[0]);
    } else {
      return this.renderAddDirectory();
    }
  }
}

module.exports = DirectoriesTab;
