jest.dontMock("../Item");
jest.dontMock("../ACLList");
jest.dontMock("../../utils/Util");

let Item = require("../Item");
let ACLList = require("../ACLList");

describe("ACLList", function () {

  describe("#constructor", function () {

    it("creates instances of Item", function () {
      let items = [{foo: "bar"}];
      let list = new ACLList({items});
      items = list.getItems();
      expect(items[0] instanceof Item).toBeTruthy();
    });

  });

});
