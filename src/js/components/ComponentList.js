import classNames from 'classnames';
import {Link} from 'react-router';
import {List} from 'reactjs-components';
import React from 'react';

import ResourceTableUtil from '../utils/ResourceTableUtil';
import UnitHealthUtil from '../utils/UnitHealthUtil';

class ComponentList extends React.Component {

  getComponentListContent(units) {
    return units.map(function (unit) {

      let health = unit.getHealth();
      let healthClasses = classNames(
        'h4 inverse flush-top flush-bottom text-align-right',
        health.classNames
      );

      return {
        content: [
          {
            className: null,
            content: (
              <Link to="settings-system-units-unit-nodes-panel"
                params={{unitID: unit.get('id')}}
                className="h4 inverse flush-top flush-bottom clickable">
                {unit.getTitle()}
              </Link>
            ),
            tag: 'span'
          },
          {
            className: null,
            content: (
              <div key="health" className={healthClasses}>
                {health.title}
              </div>
            ),
            tag: 'div'
          }
        ]
      };
    });
  }

  getVisibleComponents(units, displayCount) {
    let sortFunction = ResourceTableUtil.getStatSortFunction(
      'id',
      UnitHealthUtil.getHealthSorting
    )();

    units = units.sort(sortFunction);

    if (units.length > displayCount) {
      return units.slice(0, displayCount);
    }

    return units;
  }

  getErrorMessage() {
    return (
      <div className="flex-box flex-box-align-vertical-center">
        <div className="vertical-center">
          <h3 className="flush-top inverse text-align-center">Components Not Found</h3>
          <p className="inverse flush text-align-center">An error has occurred.</p>
        </div>
      </div>
    );
  }

  render() {
    let units = this.props.units.getItems();
    if (units.length === 0) {
      return this.getErrorMessage();
    }

    let {displayCount} = this.props;
    let visibleUnits = this.getVisibleComponents(units, displayCount);

    let content = this.getComponentListContent(visibleUnits);

    return (
      <div className="component-list-component">
        <List
          className="list list-unstyled flush"
          content={content}
          transition={false} />
      </div>
    );
  }
}

ComponentList.defaultProps = {
  displayCount: 0
};

ComponentList.propTypes = {
  displayCount: React.PropTypes.number,
  // Required object of type HealthUnitsList.
  units: React.PropTypes.object.isRequired
};

module.exports = ComponentList;
