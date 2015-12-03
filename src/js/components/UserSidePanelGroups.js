import React from "react";
import {Table} from "reactjs-components";

import ResourceTableUtil from "../utils/ResourceTableUtil";
import TableUtil from "../utils/TableUtil";

export default class UserSidePanelGroups extends React.Component {

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
        <button className="button button-danger button-stroke button-small">Remove</button>
      </div>
    );
  }

  render() {
    let groupData = this.props.userDetails.groups.map(function (group) {
      return group.group;
    });

    return (
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
    );
  }
}
