var DOMProperty = require("react/lib/DOMProperty");

// hack for getting react to render clip-path attribute
DOMProperty.injection.injectDOMPropertyConfig({
  isCustomAttribute: function (attributeName) {
    return (attributeName === "clip-path");
  }
});
