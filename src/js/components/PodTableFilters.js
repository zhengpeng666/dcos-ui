import classNames from 'classnames';
import React from 'react';

import FilterBar from './FilterBar';
import FilterButtons from './FilterButtons';
import FilterHeadline from './FilterHeadline';
import FilterInputText from './FilterInputText';

const METHODS_TO_BIND = [
];

class PodTableFilters extends React.Component {
  constructor() {
    super();

    this.state = {
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  render() {
    return (
      <div className="flex-container-col flex-grow">
        Header here
      </div>
      );
  }

}

PodTableFilters.defaultProps = {
};

PodTableFilters.propTypes = {
};

module.exports = PodTableFilters;
