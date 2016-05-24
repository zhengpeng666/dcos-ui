import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import Breadcrumb from '../../components/Breadcrumb';
import {documentationURI} from '../../config/Config';
import PageHeader from '../../components/PageHeader';
import RequestErrorMsg from '../../components/RequestErrorMsg';
import serviceDefaultURI from '../../../img/services/icon-service-default-medium@2x.png';
import StringUtil from '../../utils/StringUtil';
import UnitHealthStore from '../../stores/UnitHealthStore';
import UnitSummaries from '../../constants/UnitSummaries';

const METHODS_TO_BIND = [
  'buildCrumb',
  'crumbCustomParams'
];

class UnitsHealthNodeDetail extends mixin(StoreMixin) {

  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: 'unitHealth',
        events: ['unitSuccess', 'unitError', 'nodeSuccess', 'nodeError']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();

    let {unitID, unitNodeID} = this.props.params;

    UnitHealthStore.fetchUnit(unitID);
    UnitHealthStore.fetchUnitNode(unitID, unitNodeID);
  }

  getErrorNotice() {
    return (
      <div className="container container-pod">
        <RequestErrorMsg />
      </div>
    );
  }

  getNode() {
    return UnitHealthStore.getNode(this.props.params.unitNodeID);
  }

  getNodeInfo(unit, node) {
    let unitSummary = UnitSummaries[unit.get('id')] || {};
    let unitDocsURL = unitSummary.getDocumentationURI &&
      unitSummary.getDocumentationURI();

    if (!unitDocsURL) {
      unitDocsURL = documentationURI;
    }

    return (
      <div className="flex-container-col flex-grow">
        <span className="h4 inverse flush-top">Summary</span>
        <p className="inverse">
          {unitSummary.summary}
        </p>
        <p className="inverse">
          <a href={unitDocsURL} target="_blank">
            View Documentation
          </a>
        </p>
        <span className="h4 inverse">Output</span>
        <pre className="flex-grow flush-bottom">
          {node.getOutput()}
        </pre>
      </div>
    );
  }

  getSubTitle(unit, node) {
    let healthStatus = node.getHealth();

    return (
      <ul className="list-inline flush-bottom">
        <li>
          <span className={healthStatus.classNames}>
            {healthStatus.title}
          </span>
        </li>
        <li>
          {node.get('host_ip')}
        </li>
      </ul>
    );
  }

  getUnit() {
    return UnitHealthStore.getUnit(this.props.params.unitID);
  }

  buildCrumb(label, route, routeParams, labelIsParam, customParams) {
    if (labelIsParam) {
      label = customParams[label];
    } else {
      label = StringUtil.idToTitle([label], ['-']);
    }

    return [{label, route}];
  }

  crumbCustomParams(unit) {
    return {
      unitNodeID: `${unit.getTitle()} Health Check`,
      unitID: unit.getTitle()
    };
  }

  render() {
    let node = this.getNode();
    let unit = this.getUnit();
    let serviceIcon = <img src={serviceDefaultURI} />;

    return (
      <div className="flex-container-col">
        <Breadcrumb
          buildCrumb={this.buildCrumb}
          buildCrumbCustomParams={this.crumbCustomParams(unit)} />
        <PageHeader
          icon={serviceIcon}
          iconClassName="icon-app-container"
          subTitle={this.getSubTitle(unit, node)}
          title={`${unit.getTitle()} Health Check`} />
        <div className="flex-container-col flex-grow no-overflow">
          {this.getNodeInfo(unit, node)}
        </div>
      </div>
    );
  }
};

module.exports = UnitsHealthNodeDetail;
