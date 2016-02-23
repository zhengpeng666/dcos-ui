/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

import HealthUnit from '../structs/HealthUnit';
import Node from '../structs/Node';
import RequestErrorMsg from './RequestErrorMsg';
import SidePanelContents from './SidePanelContents';

module.exports = class UnitNodeSidePanelContents extends SidePanelContents {

  getHeader(unit, node) {
    let imageTag = (
      <div className="side-panel-icon icon icon-large icon-image-container
        icon-app-container">
      </div>
    );

    return (
      <div className="side-panel-content-header-details flex-box
        flex-box-align-vertical-center">
        {imageTag}
        <div>
          <h1 className="side-panel-content-header-label flush">
            {unit.get('unit_description')}
          </h1>
          <div>
            {this.getSubHeader(unit, node)}
          </div>
        </div>
      </div>
    );
  }

  getErrorNotice() {
    return (
      <div className="container container-pod">
        <RequestErrorMsg />
      </div>
    );
  }

  getSubHeader(unit, node) {
    let healthStatus = unit.getHealth();

    return (
      <ul className="list-inline flush-bottom">
        <li>
          <span className={healthStatus.classNames}>
            {`${healthStatus.title} Health Check`}
          </span>
        </li>
        <li>
          {node.get('node_id')}
        </li>
      </ul>
    );
  }

  getNodeData() {
    return new Node(
      {
        'node_id': 'ip-10-10-0-235',
        'node_role': 'master',
        'node_health': 3,
        'unit_check_output': '{\r\n  \"path\": \"\/health\/cluster\",\r\n  \"protocol\": \"HTTP\",\r\n  \"portIndex\": 0\r\n}'
      }
    );
  }

  // demo
  getUnitData() {
    return new HealthUnit(
      {
        'unit_id': this.props.itemID,
        'unit_description': this.props.itemID,
        'health': 1
      }
    );
  }

  getNodeInfo(unit, node) {
    return (
      <div>
        <span className="h4">Summary</span>
        <p>{unit.get('unit_description')}</p>
        <span className="h4">Output</span>
        <pre>
          {node.get('unit_check_output')}
        </pre>
      </div>
    );
  }

  render() {
    let node = this.getNodeData();
    let unit = this.getUnitData();

    return (
      <div className="flex-container-col">
        <div className="container container-fluid container-pod
          container-pod-divider-bottom container-pod-divider-bottom-align-right
          container-pod-divider-inverse container-pod-short-top
          side-panel-content-header side-panel-section">
          {this.getHeader(unit, node)}
        </div>
        <div className="side-panel-tab-content side-panel-section container
          container-fluid container-pod container-pod-short container-fluid
          flex-container-col flex-grow no-overflow">
          <div className="flex-container-col flex-grow no-overflow">
            {this.getNodeInfo(unit, node)}
          </div>
        </div>
      </div>
    );
  }
};
