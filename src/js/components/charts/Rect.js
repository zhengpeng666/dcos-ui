import React from 'react';

const PropTypes = React.PropTypes;

class Rect extends React.Component {
  componentDidMount() {
    this.transitionRect(this.props);
  }

  componentWillUpdate(nextProps) {
    this.transitionRect(nextProps);
  }

  transitionRect(props) {
    let {transitionDuration, transform} = props;
    let el = this.rect;

    d3.select(el)
      .transition()
      .duration(transitionDuration)
      .ease('linear')
      .attr('transform', transform);
  }

  render() {
    let {width, height, x, y, fill, className} = this.props;

    return (
      <rect
        ref={(ref) => { this.rect = ref; }}
        width={width}
        height={height}
        x={x}
        y={y}
        fill={fill}
        className={className} />
    );
  }
}

Rect.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  fill: PropTypes.string,
  className: PropTypes.string,
  transitionDuration: PropTypes.number,
  transform: PropTypes.string,
  key: PropTypes.any
};

module.exports = Rect;
