jest.dontMock("../User");
jest.dontMock("../UsersList");
jest.dontMock("../../utils/Util");

let User = require("../User");
let UsersList = require("../UsersList");

describe("UsersList", function () {

  describe("#constructor", function () {

    it("creates instances of User", function () {
      let items = [{foo: "bar"}];
      let list = new UsersList({items});
      items = list.getItems();
      expect(items[0] instanceof User).toBeTruthy();
    });

  });

});
