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
    enabled: false
  },

  /**
   * @param  {Object} Plugins The Plugins API
   */
  initialize: function (Plugins) {
    Plugins.addFilter("renderIndex", this.renderIndex.bind(this));
    Plugins.addAction("indexDidUpdate", this.indexDidUpdate.bind(this));
  },

  configure: function (configuration) {
    this.configuration = _.extend(this.configuration, configuration);
  },

  isEnabled() {
    return this.configuration.enabled;
  },

  renderIndex: function () {
    if (inIframe()) {
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

  indexDidUpdate: function () {
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
  }
};

export default BannerPlugin;
