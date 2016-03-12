import {Modal} from 'reactjs-components';
import React from 'react';

import IconBack from '../icons/IconBack';
import {keyCodes} from '../../utils/KeyboardUtil';

const METHODS_TO_BIND = ['handleKeyPress'];

class ImageViewerModal extends React.Component {
  constructor() {
    super(...arguments);

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    if (this.props.open) {
      global.window.addEventListener('keydown', this.handleKeyPress, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    let {props} = this;
    if (props.open && !nextProps.open) {
      // closes
      global.window.removeEventListener('keydown', this.handleKeyPress, true);
    }

    if (!props.open && nextProps.open) {
      // Opens
      global.window.addEventListener('keydown', this.handleKeyPress, true);
    }
  }

  handleKeyPress(event) {
    if (event.defaultPrevented) {
      return; // Should do nothing if the key event was already consumed.
    }

    let {props} = this;
    if (event.keyCode === keyCodes.leftArrow) {
      props.onLeftClick();
    }

    if (event.keyCode === keyCodes.rightArrow) {
      props.onRightClick();
    }

    // Consume the event for suppressing "double action".
    event.preventDefault();
  }

  getSelectedImage() {
    let {props} = this;
    return (
      <div className="fill-image-contianer">
        <img
          className="fill-image"
          src={props.images[props.selectedImage]} />
      </div>
    );
  }

  getFooter() {
    let {props} = this;
    return (
      <div onKeyPress={this.handleKeyPress}>
        <span
          onClick={props.onLeftClick}
          className="clickable arrow-container">
          <IconBack className="icon icon-back icon-small arrow" />
        </span>
        <span
          className="clickable arrow-container forward"
          onClick={props.onRightClick}>
          <IconBack
            className="icon icon-back icon-small arrow"
            isForward={true} />
        </span>
      </div>
    );
  }

  render() {
    let {props} = this;

    return (
      <Modal
        footer={this.getFooter()}
        innerBodyClass=""
        maxHeightPercentage={0.9}
        modalClass="modal modal-image-viewer"
        onClose={props.onClose}
        open={props.open}
        showCloseButton={true}
        showFooter={true}
        showHeader={true}>
        {this.getSelectedImage()}
      </Modal>
    );
  }
}

ImageViewerModal.defaultProps = {
  images: []
};

ImageViewerModal.propTypes = {
  images: React.PropTypes.array,
  onLeftClick: React.PropTypes.func.isRequired,
  onRightClick: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired
};

module.exports = ImageViewerModal;
