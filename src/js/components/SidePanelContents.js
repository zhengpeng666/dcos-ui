import _ from 'underscore';
import React from 'react/addons';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import BarChart from './charts/BarChart';
import Chart from './charts/Chart';
import Config from '../config/Config';
import InternalStorageMixin from '../mixins/InternalStorageMixin';
import MesosSummaryStore from '../stores/MesosSummaryStore';
import ResourceTypes from '../constants/ResourceTypes';
import TabsMixin from '../mixins/TabsMixin';
import Units from '../utils/Units';

import mixin from 'reactjs-mixin';

// number to fit design of width vs. height ratio
const WIDTH_HEIGHT_RATIO = 4.5;

export default class SidePanelContents extends
  mixin(InternalStorageMixin, TabsMixin, StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [];

    this.tabs_tabs = {
      tasks: 'Tasks',
      details: 'Details'
    };

    this.state = {};
  }

  componentDidMount() {
    super.componentDidMount();
    this.mountedAt = Date.now();
  }

  getKeyValuePairs(hash, headline) {
    if (_.isEmpty(hash)) {
      return null;
    }

    let items = Object.keys(hash).map(function (key) {
      return (
        <dl key={key} className="flex-box row">
          <dt className="column-3 emphasize">
            {key}
          </dt>
          <dd className="column-9">
            {hash[key]}
          </dd>
        </dl>
      );
    });

    // Wrap in headline element and classes
    if (headline != null) {
      headline = (
        <h6 className="flush-top">
          {headline}
        </h6>
      );
    }

    return (
      <div className="container container-fluid container-pod container-pod-short flush-bottom">
        {headline}
        {items}
      </div>
    );
  }

  getResourceChart(resource, totalResources) {
    let colorIndex = ResourceTypes[resource].colorIndex;
    let resourceLabel = ResourceTypes[resource].label;
    let resourceData = [{
      name: 'Alloc',
      colorIndex: colorIndex,
      values: totalResources[resource]
    }];
    let resourceValue = Units.formatResource(
      resource, _.last(totalResources[resource]).value
    );
    let resourceIconClasses = `icon icon-sprite icon-sprite-medium
      icon-sprite-medium-color icon-resources-${resourceLabel.toLowerCase()}`;

    let axisConfiguration = {
      x: {hideMatch: /^0$/},
      y: {showPercentage: false, suffix: '%'}
    };

    let maxY = 5;
    totalResources[resource].forEach(function (resourceTotal) {
      if (resourceTotal.percentage > maxY) {
        maxY = resourceTotal.percentage;
      }
    });

    maxY *= 1.5; // Multiply by 150%
    maxY /= 10; // Divide so that we can round to nearest tenth
    maxY = Math.round(maxY); // Round
    maxY *= 10; // Multiply so that we get a percentage number between 0-100
    maxY = Math.min(100, maxY); // Don't let it be greater than 100%

    return (
      <div key={resource} className="column-12
        flex-box-align-vertical-center
        container-pod
        container-pod-super-short
        flush-top">
        <div className="media-object media-object-align-middle">
          <div className="media-object-icon media-object-icon-medium">
            <i className={resourceIconClasses}></i>
          </div>
          <div className="media-object-content">
            <h4 className="flush-top flush-bottom text-color-neutral">
              {resourceValue}
            </h4>
            <span className={`side-panel-resource-label
                text-color-${colorIndex}`}>
              {resourceLabel.toUpperCase()}
            </span>
          </div>
        </div>

        <Chart calcHeight={function (w) { return w / WIDTH_HEIGHT_RATIO; }}
          delayRender={true}>
          <BarChart
            axisConfiguration={axisConfiguration}
            data={resourceData}
            inverseStyle={true}
            margin={{top: 0, left: 43, right: 10, bottom: 40}}
            maxY={maxY}
            refreshRate={Config.getRefreshRate()}
            ticksY={3}
            xGridLines={0}
            y="percentage" />
        </Chart>
      </div>
    );
  }

  getCharts(itemType, item) {
    if (!item) {
      return null;
    }

    let states = MesosSummaryStore.get('states');
    let resources = states[`getResourceStatesFor${itemType}IDs`]([item.id]);

    let charts = [
      this.getResourceChart('cpus', resources),
      this.getResourceChart('mem', resources),
      this.getResourceChart('disk', resources)
    ];

    return charts.map(function (chart, i) {
      return (
        <div key={i} className="column-12 column-mini-4">
          <div className="row chart">
            {chart}
          </div>
        </div>
      );
    });
  }

  getNotFound(itemType) {
    return (
      <div className="container container-fluid container-pod text-align-center">
        <h3 className="flush-top text-align-center">
          {`Error finding ${itemType}`}
        </h3>
        <p className="flush">{`Did not find a ${itemType} by the id "${this.props.itemID}"`}</p>
      </div>
    );
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
}

SidePanelContents.propTypes = {
  itemID: React.PropTypes.string,
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool
};

SidePanelContents.animationLengthSeconds = 0.5;
