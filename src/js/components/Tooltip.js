import React from 'react';

import TooltipMixin from '../mixins/TooltipMixin';

let Tooltip = React.createClass({

  displayName: 'Tooltip',

  mixins: [TooltipMixin],

  propTypes: {
    behavior: React.PropTypes.string,
    content: React.PropTypes.string,
    iconClass: React.PropTypes.string,
    tipPlace: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      behavior: 'show-tip',
      content: '',
      iconClass: '',
      tipPlace: 'top'
    };
  },

  render: function () {
    let {props} = this;
    let tooltipAttributes = {
      'data-behavior': props.behavior,
      'data-tip-place': props.tipPlace,
      'data-tip-content': props.content
    };

    return (
      <span>
        {this.props.children}
        <i className={props.iconClass}
          {...tooltipAttributes} />
      </span>
    );
  }
});

module.exports = Tooltip;
