import classNames from 'classnames';
import React from 'react';

class FilterButtons extends React.Component {

  getCountByKey(items, key) {
    let counts = {};
    key = key.toLowerCase();

    items.forEach(function (item) {
      let value = item[key];
      if (typeof value === 'string') {
        value = value.toLowerCase();
      }

      counts[value] = (counts[value] + 1) || 1;
    });

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
          {this.props.renterButtonContent(filter, filterCount[filter])}
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
  renterButtonContent: function (title) {return title; }
};

FilterButtons.propTypes = {
  // Optional function to generate button text. args: (filter, count)
  renterButtonContent: React.PropTypes.func,
  filters: React.PropTypes.array,
  // The key in itemList that is being filtered
  filterByKey: React.PropTypes.string.isRequired,
  // A function that returns the onClick for a filter button given the filter.
  getfilterChangeHandler: React.PropTypes.func,
  itemList: React.PropTypes.array.isRequired,
  // The filter in props.filters that is currently selected.
  selectedFilter: React.PropTypes.string
};

module.exports = FilterButtons;
