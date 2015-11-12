import _ from "underscore";
import classNames from "classnames";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

const BannerPlugin = {

  configuration: {
    backgroundColor: null,
    foregroundColor: null,
    headerTitle: null,
    headerContent: null,
    footerContent: null,
    imagePath: null,
    dismissible: null
  },

  enabled: false,

  /**
   * @param  {Object} Plugins The Plugins API
   */
  initialize: function (Plugins) {
    Plugins.addAction("applicationIsMounted",
      this.applicationIsMounted.bind(this)
    );
    Plugins.addFilter("applicationContents",
      this.applicationContents.bind(this)
    );
    Plugins.addFilter(
      "renderOverlayNewWindowButton",
      this.renderOverlayNewWindowButton.bind(this)
    );
  },

  configure: function (configuration) {
    this.enabled = true;
    this.configuration = configuration;
  },

  isEnabled: function () {
    return this.enabled;
  },

  applicationIsMounted: function () {
    if (!this.isEnabled()) {
      return;
    }

    let frame = document.getElementById("banner-plugin-iframe");
    if (frame == null) {
      return;
    }

    if (this.historyListenerAdded) {
      return;
    }

    this.historyListenerAdded = true;
    let frameWindow = frame.contentWindow;
    let topWindow = window;

    frameWindow.addEventListener("popstate", function () {
      topWindow.location.hash = frameWindow.location.hash;
    });
  },

  applicationContents: function () {
    if (inIframe() || !this.isEnabled()) {
      return null;
    }

    let configuration = this.configuration;

    let imageClassSet = classNames({
      "icon icon-small icon-image-container icon-app-container": true,
      "hidden": configuration.imagePath == null ||
        configuration.imagePath === ""
    });

    let headerClassSet = classNames({
      "title flush-top flush-bottom": true,
      "hidden": configuration.headerTitle == null ||
        configuration.headerTitle === ""
    });

    let styles = {
      color: configuration.foregroundColor,
      backgroundColor: configuration.backgroundColor
    };

    return (
      <div className="bannerPlugin">
        <header style={styles}>
          <span>
            <span className={imageClassSet}>
              <img src={configuration.imagePath} />
            </span>
            <h5
              className={headerClassSet}
              style={_.pick(styles, "color")}>
              {configuration.headerTitle}
            </h5>
          </span>
          <span className="content" title={configuration.headerContent}>
            {configuration.headerContent}
          </span>
        </header>
        <iframe
          frameBorder="0"
          id="banner-plugin-iframe"
          src={window.location.href}
          style={{width: "100%", height: "100%"}} />
        <footer style={styles}>
          <span className="content" title={configuration.footerContent}>
            {configuration.footerContent}
          </span>
        </footer>
      </div>
    );
  },

  renderOverlayNewWindowButton: function (button) {
    if (this.isEnabled()) {
      return null;
    }

    return button;
  }

};

export default BannerPlugin;
