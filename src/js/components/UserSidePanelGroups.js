import React from "react";
import {Confirm, Table} from "reactjs-components";

import ResourceTableUtil from "../utils/ResourceTableUtil";
import TableUtil from "../utils/TableUtil";

const METHODS_TO_BIND = [
  "handleOpenConfirm",
  "handleButtonConfirm",
  "handleButtonCancel",
  "renderButton"
];

export default class UserSidePanelGroups extends React.Component {
  constructor() {
    super();

    this.state = {
      groupID: null,
      openConfirm: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleOpenConfirm(groupID) {
    console.log(groupID);
    this.setState({groupID, openConfirm: true});
  }

  handleButtonConfirm() {
    this.setState({openConfirm: false});
  }

  handleButtonCancel() {
    this.setState({openConfirm: false});
  }

  handleGroupRemoval(group) {
    console.log(group);
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: "50%"}} />
        <col />
      </colgroup>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let descriptionHeading = ResourceTableUtil.renderHeading({
      description: "Description"
    });
    let propSortFunction = ResourceTableUtil.getPropSortFunction("description");

    return [
      {
        className,
        headerClassName: className,
        prop: "description",
        render: this.renderGroup,
        sortable: true,
        sortFunction: propSortFunction,
        heading: descriptionHeading
      },
      {
        className,
        headerClassName: className,
        prop: "remove",
        render: this.renderButton,
        sortable: false,
        sortFunction: propSortFunction,
        heading: ""
      }
    ];
  }

  renderGroup(prop, group) {
    return group[prop];
  }

  renderButton(prop, group) {
    return (
      <div className="text-align-right">
        <button className="button button-danger button-stroke button-small"
          onClick={this.handleOpenConfirm.bind(this, group.gid)}>
          Remove
        </button>
      </div>
    );
  }

  render() {
    let groupData = this.props.userDetails.groups.map(function (group) {
      return group.group;
    });

    return (
      <div>
        <Confirm
          open={this.state.openConfirm}
          onClose={this.handleButtonCancel}
          leftButtonCallback={this.handleButtonCancel}
          rightButtonCallback={this.handleButtonConfirm}>
          <div className="container-pod">
            Would you like to perform this action?
          </div>
        </Confirm>
        <div className="container container-fluid container-pod">
          <Table
            className="table table-borderless-outer table-borderless-inner-columns
              flush-bottom no-overflow flush-bottom"
            columns={this.getColumns()}
            colGroup={this.getColGroup()}
            data={groupData}
            idAttribute="gid"
            itemHeight={TableUtil.getRowHeight()}
            sortBy={{prop: "description", order: "asc"}}
            useFlex={true}
            transition={false}
            useScrollTable={false} />
        </div>
      </div>
    );
  }
}
