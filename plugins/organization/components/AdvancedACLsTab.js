import {Form, Table} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
import ReactDOM from 'react-dom';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

let SDK = require('../SDK').getSDK();
import ACLActions from '../submodules/acl/actions/ACLActions';

let {InternalStorageMixin, RequestErrorMsg, ResourceTableUtil,
  TableUtil, TooltipMixin} =  SDK.get([
    'InternalStorageMixin', 'RequestErrorMsg', 'ResourceTableUtil',
    'TableUtil', 'TooltipMixin'
  ]);

const METHODS_TO_BIND = [
  'setTriggerSubmit',
  'handleFormButtonClick',
  'handleFormSubmit',
  'renderActions',
  // Must bind these due to TooltipMixin legacy code
  'tip_handleContainerMouseMove',
  'tip_handleMouseLeave'
];

class AdvancedACLsTab extends
  mixin(InternalStorageMixin, StoreMixin, TooltipMixin) {
  constructor() {
    super();

    this.state = {
      aclsRequestSuccess: false,
      aclsRequestErrors: 0,
      creatingACL: false,
      formKey: 0,
      formPermissionValue: '',
      formResourceValue: '',
      itemPermissionsRequestSuccess: false,
      itemPermissionsRequestErrors: 0
    };

    this.store_listeners = [
      {
        name: 'acl',
        events: ['fetchResourceSuccess', 'fetchResourceError']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    ACLActions.fetchACLs();
  }

  onStorePermissionsSuccess() {
    this.setState({
      itemPermissionsRequestSuccess: true,
      itemPermissionsRequestErrors: 0
    });
  }

  onAclStoreFetchResourceSuccess() {
    this.setState({aclsRequestSuccess: true, aclsRequestErrors: 0});
  }

  onAclStoreFetchResourceError() {
    this.setState({aclsRequestErrors: this.state.aclsRequestErrors + 1});
  }

  onAclStoreCreateResponse(clearPermissionField = false) {
    let state = {creatingACL: false};

    if (clearPermissionField) {
      state.formKey = this.state.formKey + 1;
      state.formPermissionValue = '';
      setTimeout(() => {
        let form = ReactDOM.findDOMNode(this);
        let input = form.querySelector('input[name=action]');
        input.focus();
      }, 100);
    }

    this.setState(state);
  }

  onAclStoreRevokeResponse() {
    let data = this.internalStorage_get();

    data.revokeActionsRemaining = data.revokeActionsRemaining - 1;

    this.internalStorage_set({
      revokeActionsRemaining: data.revokeActionsRemaining
    });

    if (data.revokeActionsRemaining <= 0) {
      this.forceUpdate();
    }
  }

  handleFormButtonClick() {
    this.triggerSubmit();
  }

  handleFormSubmit(formData) {
    this.setState({
      creatingACL: true,
      formPermissionValue: formData.action,
      formResourceValue: formData.resource
    });
  }

  setTriggerSubmit(trigger) {
    this.triggerSubmit = trigger;
  }

  getForm() {
    return (
      <Form
        key={this.state.formKey}
        className="form flush-bottom column-12 column-large-9 column-small-10"
        formGroupClass="form-group flush-bottom"
        definition={[
          [
            {
              columnWidth: 9,
              disabled: this.state.creatingACL,
              fieldType: 'text',
              name: 'resource',
              placeholder: 'Resource',
              required: true,
              showLabel: false,
              writeType: 'input',
              validation: function () { return true; },
              value: this.state.formResourceValue
            },
            {
              columnWidth: 3,
              disabled: this.state.creatingACL,
              fieldType: 'text',
              name: 'action',
              placeholder: 'Permission',
              required: true,
              showLabel: false,
              writeType: 'input',
              validation: function () { return true; },
              value: this.state.formPermissionValue
            }
          ]
        ]}
        triggerSubmit={this.setTriggerSubmit}
        onSubmit={this.handleFormSubmit} />
    );
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '60%'}} />
        <col />
      </colgroup>
    );
  }

  renderActions(prop, acl) {
    let actions = acl.actions.map((action, i) => {
      let comma = ', ';

      if (i === (acl.actions.length - 1)) {
        comma = '';
      }

      return (
        <span key={i}>
          <a
            className="clickable text-color-8"
            data-behavior="show-tip"
            data-tip-place="top"
            data-tip-content="Remove Permission"
            onClick={this.handleActionRevokeClick.bind(
              this, acl.rid, [action]
            )}>
            {action}
          </a>
         <span>{comma}</span>
        </span>
      );
    });

    return (
      <div className="flex-box flex-align-items-center">
        <div className="flex-grow">
          {actions}
        </div>
        <button
          className="button button-small button-link button-danger horizon"
          onClick={this.handleActionRevokeClick.bind(
            this, acl.rid, acl.actions
          )}>
          Remove
        </button>
      </div>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let descriptionHeading = ResourceTableUtil.renderHeading({
      rid: 'Resource'
    });
    let propSortFunction = ResourceTableUtil.getPropSortFunction('rid');

    return [
      {
        className,
        headerClassName: className,
        prop: 'rid',
        sortable: true,
        sortFunction: propSortFunction,
        heading: descriptionHeading
      },
      {
        className,
        headerClassName: className,
        prop: 'actions',
        render: this.renderActions,
        sortable: false,
        heading: 'Permissions'
      }
    ];
  }

  getLoadingScreen() {
    return (
      <div className="container container-fluid container-pod text-align-center
        vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.aclsRequestErrors >= 3 ||
      this.state.itemPermissionsRequestErrors >= 3) {
      return <RequestErrorMsg />;
    }

    if (!this.state.aclsRequestSuccess ||
        !this.state.itemPermissionsRequestSuccess) {
      return this.getLoadingScreen();
    }

    return (
      <div>
        <div className="container container-fluid container-pod
          container-pod-short flush-bottom">
        </div>
        <div className="container container-fluid container-pod
          container-pod-short">
          <div className="row">
            {this.getForm()}
            <div className="column-12 column-large-3 column-small-2">
              <button
                className="button button-success button-wide"
                onClick={this.handleFormButtonClick}
                disabled={this.state.creatingACL}>
                Add Rule
              </button>
            </div>
          </div>
        </div>
        <div className="container container-fluid container-pod container-pod-short">
          <Table
              className="table table-borderless-outer
                table-borderless-inner-columns flush-bottom flush-bottom"
              columns={this.getColumns()}
              colGroup={this.getColGroup()}
              containerSelector=".gm-scroll-view"
              data={this.getACLs()}
              itemHeight={TableUtil.getRowHeight()}
              sortBy={{prop: 'rid', order: 'asc'}}
            />
        </div>
      </div>
    );
  }
}

AdvancedACLsTab.propTypes = {
  itemID: React.PropTypes.string.isRequired
};

module.exports = AdvancedACLsTab;
