import classNames from 'classnames';
import React from 'react';

export default class FilterButtons extends React.Component {

  getCountByKey(items, key) {
    key = key.toLowerCase();

    let counts = items.reduce(function (accumulated, item) {
      let value = item[key];
      if (typeof value === 'string') {
        value = value.toLowerCase();
      }

      if (accumulated[value] === undefined) {
        accumulated[value] = 1;
      } else {
        accumulated[value] += 1;
      }
      return accumulated;
    }, {});

    // Include a key 'all' that is the total itemList size.
    counts.all = items.length;

    return counts;
  }

  getFilterButtons() {
    let {filterByKey, filters, itemList, selectedFilter} = this.props;
    let filterCount = this.getCountByKey(itemList, filterByKey);

    return filters.map((filter) => {
      let classSet = classNames({
        'button button-stroke button-inverse': true,
        'active': filter.toLowerCase() === selectedFilter.toLowerCase()
      });

      return (
        <button
          key={filter}
          className={classSet}
          onClick={this.props.getfilterChangeHandler(filter)}>
          {this.props.buttonContent(filter, filterCount[filter])}
        </button>
      );
    });
  }

  render() {
    return (
      <div className="panel-options-left button-group">
        {this.getFilterButtons()}
      </div>
    );
  }
}

FilterButtons.defaultProps = {
  buttonContent: function (title) {return title; }
};

FilterButtons.propTypes = {
  // Optional function to generate button text. args: (filter, count)
  buttonContent: React.PropTypes.func,
  filters: React.PropTypes.array,
  // The key in itemList that is being filtered
  filterByKey: React.PropTypes.string.isRequired,
  // A function that returns the onClick for a filter button given the filter.
  getfilterChangeHandler: React.PropTypes.func,
  itemList: React.PropTypes.array.isRequired,
  // The filter in props.filters that is currently selected.
  selectedFilter: React.PropTypes.string
};
