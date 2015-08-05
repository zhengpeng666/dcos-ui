var classNames = require("classnames");
var React = require("react");
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var GeminiScrollbar = require("react-gemini-scrollbar");
var DOMUtils = require("../utils/DOMUtils");

var Modal = React.createClass({

  displayName: "Modal",

  propTypes: {
    closeByBackdropClick: React.PropTypes.bool,
    closeText: React.PropTypes.string,
    footer: React.PropTypes.object,
    showCloseButton: React.PropTypes.bool,
    showFooter: React.PropTypes.bool,
    size: React.PropTypes.string,
    subHeader: React.PropTypes.node,
    titleText: React.PropTypes.string,
    open: React.PropTypes.bool,
    onClose: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      closeByBackdropClick: true,
      closeText: "Close",
      showCloseButton: true,
      titleText: "",
      size: "",
      subHeader: "",
      maxHeightPercentage: 0.6,
      open: false,
      onClose: function () {}
    };
  },

  componentDidMount: function () {
    this.forceUpdate();

    window.addEventListener("resize", this.handleWindowResize);
  },

  componentDidUpdate: function () {
    // We render once in order to compute content height,
    // then we rerender to make modal fit the screen, if needed.
    // Set rerendered to true to only do this once.
    if (!this.rerendered && this.props.open) {
      this.rerendered = true;
      this.forceUpdate();
    }
  },

  componentWillUnmount: function () {
    window.removeEventListener("resize", this.handleWindowResize);
  },

  shouldComponentUpdate: function (nextProps) {
    return nextProps.open !== this.props.open;
  },

  handleWindowResize: function () {
    this.forceUpdate();
  },

  handleBackdropClick: function () {
    if (this.props.closeByBackdropClick) {
      this.closeModal();
    }
  },

  closeModal: function () {
    this.rerendered = false;
    this.props.onClose();
  },

  getInnerContainerHeightInfo: function () {
    var innerContainer = this.refs.innerContainer;
    if (innerContainer === undefined) {
      return null;
    }
    var innerContainerNode = innerContainer.getDOMNode();

    var originalHeight = innerContainerNode.offsetHeight;

    // Height without padding, margin, border.
    var innerHeight = DOMUtils.getComputedDimensions(innerContainerNode).height;

    // Height of padding, margin, border.
    var outerHeight = originalHeight - innerHeight;

    // Modal cannot be bigger than this height.
    var maxHeight = DOMUtils.getPageHeight() * this.props.maxHeightPercentage;

    return {
      // Add 10 for the gemini horizontal scrollbar
      maxHeight: Math.min(originalHeight, maxHeight + 10),

      // We minus the maxHeight with the outerHeight because it will
      // not show the content correctly due to 'box-sizing: border-box'.
      innerHeight: Math.min(innerHeight, maxHeight - outerHeight)
    };
  },

  getCloseButton: function () {
    if (!this.props.showCloseButton) {
      return null;
    }

    return (
      <a className="modal-close">
        <span className="modal-close-title">
          Close
        </span>
        <i className="modal-close-icon icon icon-mini icon-mini-white icon-close"></i>
      </a>
    );
  },

  getFooter: function () {
    if (this.props.showFooter === false) {
      return null;
    }

    return (
      <div className="modal-footer">
        <div className="container container-pod container-pod-short">
          {this.props.footer}
        </div>
      </div>
    );
  },

  getModalContent: function (useScrollbar, innerHeight) {
    if (!useScrollbar) {
      return (
        <div className="container-fluid">
          {this.props.children}
        </div>
      );
    }

    var geminiContainerStyle = {
      height: innerHeight
    };

    return (
      <GeminiScrollbar autoshow={true} className="container-scrollable" style={geminiContainerStyle}>
        <div className="container-fluid">
          {this.props.children}
        </div>
      </GeminiScrollbar>
    );
  },

  getModal: function () {
    if (!this.props.open) {
      return null;
    }

    var backdropClassSet = classNames({
      "fade": true,
      "in": this.props.open,
      "modal-backdrop": true
    });

    var modalClassSet = classNames({
      "modal": true,
      "modal-large": this.props.size === "large"
    });

    var titleClassSet = classNames({
      "modal-header-title": true,
      "text-align-center": true,
      "flush-top": true,
      "flush-bottom": !this.props.subHeader,
      "inverse": true
    });

    var heightInfo = this.getInnerContainerHeightInfo();
    var maxHeight = null;
    var innerHeight = null;
    var useScrollbar = false;

    if (heightInfo !== null) {
      useScrollbar = true;
      innerHeight = heightInfo.innerHeight;
      maxHeight = heightInfo.maxHeight;
    }

    var modalStyle = {
      height: maxHeight
    };

    return (
      <div className="modal-container">
        <div className={modalClassSet}>
          {this.getCloseButton()}
          <div className="modal-header">
            <div className="container container-pod container-pod-short">
              <h2 className={titleClassSet}>
                {this.props.titleText}
              </h2>
              {this.props.subHeader}
            </div>
          </div>
          <div className="modal-content" style={modalStyle}>
            <div ref="innerContainer" className="modal-content-inner container container-pod container-pod-short" style={modalStyle}>
              {this.getModalContent(useScrollbar, innerHeight)}
            </div>
          </div>
          {this.getFooter()}
        </div>
        <div className={backdropClassSet} onClick={this.handleBackdropClick}>
        </div>
      </div>
    );
  },

  render: function () {
    return (
      <CSSTransitionGroup transitionName="modal" ref="modal" component="div">
        {this.getModal()}
      </CSSTransitionGroup>
    );
  }
});

module.exports = Modal;
