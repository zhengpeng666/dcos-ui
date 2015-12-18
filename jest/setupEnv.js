// jsdom doesn't have support for localStorage at the moment
global.localStorage = require("localStorage");
global.document.body.classList = {
  add: function () {},
  remove: function () {},
  toggle: function () {}
};
