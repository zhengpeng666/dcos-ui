import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLDirectoriesStore from '../../stores/ACLDirectoriesStore';
import DirectoryActionButtons from '../../components/DirectoryActionButtons';
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
  'hangleFormChange',
  'handleModalSubmit'
];

class DirectoriesTab extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.state = {
      modalDisabled: false,
      modalOpen: false,
      fieldUseLDAPs: {
        checked: false,
        disabled: false
      },
      fieldEnforceStartTLS: {
        checked: false,
        disabled: false
      }
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

  hangleFormChange(formData, change) {
    switch (change.fieldName) {
      case 'use-ldaps':
        this.setState({
          fieldUseLDAPs: {
            checked: change.fieldValue.checked,
            disabled: false
          },
          fieldEnforceStartTLS: {
            checked: false,
            disabled: change.fieldValue.checked
          }
        });
        break;
      case 'enforce-starttls':
        this.setState({
          fieldUseLDAPs: {
            checked: false,
            disabled: change.fieldValue.checked
          },
          fieldEnforceStartTLS: {
            checked: change.fieldValue.checked,
            disabled: false
          }
        });
        break;
      default:
        break;
    }
  }

  handleModalSubmit(formData) {
    // There's deeply nested objects
    formData = JSON.parse(JSON.stringify(formData));

    var enforceStartTLS = formData['enforce-starttls'];
    var useLDAPs = formData['use-ldaps'];
    formData['enforce-starttls'] =
      !!(enforceStartTLS && enforceStartTLS.checked);
    formData['use-ldaps'] = !!(useLDAPs && useLDAPs.checked);

    ACLDirectoriesStore.addDirectory(formData);
    this.setState({
      modalDisabled: true,
      fieldUseLDAPs: {checked: false, disabled: false},
      fieldEnforceStartTLS: {checked: false, disabled: false}
    });
  }

  handleDirectoryDelete() {
    ACLDirectoriesStore.deleteDirectory();
  }

  handleDirectoryTestConnection() {
    ACLDirectoriesStore.testDirectoryConnection();
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
          'Value must contain username placeholder "%(username)s". For example: uid=%(username)s,ou=users,dc=example,dc=com',
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
        label: fieldDefinitions['use-ldaps'],
        writeType: 'input',
        checked: this.state.fieldUseLDAPs.checked,
        disabled: this.state.fieldUseLDAPs.disabled,
        validation: function () { return true; }
      },
      {
        fieldType: 'checkbox',
        name: 'enforce-starttls',
        required: false,
        showLabel: false,
        label: fieldDefinitions['enforce-starttls'],
        writeType: 'input',
        checked: this.state.fieldEnforceStartTLS.checked,
        disabled: this.state.fieldEnforceStartTLS.disabled,
        validation: function () { return true; }
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
          <dt className="column-3 emphasize lead inverse">
            {fieldDefinitions[key]}
          </dt>
          <dd className="column-9">
            {value}
          </dd>
        </dl>
      );
    });

    return (
      <div>
        <h4 className="inverse flush-top">External LDAP Configuration</h4>
        {fields}
        <div className="row">
          <div className="column-12">
            <DirectoryActionButtons />
          </div>
        </div>
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
          onChange={this.hangleFormChange}
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
