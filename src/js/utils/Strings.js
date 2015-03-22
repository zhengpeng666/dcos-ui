var Strings = {
  formatUrl: function (urlStr) {
    // only turn into ip address "ip-" is present
    if (urlStr.indexOf("ip-") > -1) {
      return urlStr.replace("ip-", "").replace(/-/g, ".");
    } else {
      return urlStr;
    }
  }
};

module.exports = Strings;
